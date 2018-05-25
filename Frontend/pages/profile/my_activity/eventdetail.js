
//获取应用实例
const app = getApp()

Page({
  data: {
    img_black_star_src: '../../../image/star_n@2x.png',
    img_yellow_star_src: '../../../image/star_s@2x.png',
    star_img_position: 25,
    id: 0,
    event: [],
    booking: [],
    rating: [],
    userInfo: [],
    eventType: [],
    userRole: [],
    eventState: [],
    register_num: 0,
    favourite_num: 0,
    isshowcancel: 1,
  },
  onLoad: function (param) {
    this.setData({
      userInfo: app.globalData.userInfo,
      eventType: app.globalData.eventType,
      userRole: app.globalData.userRole,
      eventState: app.globalData.eventState
    });

    var that = this;
    var id = param.id;
    wx.request({
      url: app.globalData.mainURL + 'api/getEventDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'event_id': id,
        'user_id': app.globalData.userInfo.user_id
      },
      success: function (res) {
        console.log("DETAIL")
        console.log(res)
        that.setData({ pay_type: ["线下支付", "线上支付"] })
        var books = res.data.booking;
        var rating_buf = res.data.rating_detail
        for (var iter = 0; iter < books.length; iter++) {
          books[iter].pay_type = 1 * books[iter].pay_type
          if (books[iter].name == null) {
            books[iter].name = books[iter].nickname
          }
        }
        for (var iter = 0; iter < rating_buf.length; iter++) {
          if (rating_buf[iter].name == null) {
            rating_buf[iter].name = rating_buf[iter].nickname
          }
          if (rating_buf[iter].comment.length > 10) {
            rating_buf[iter].comment = rating_buf[iter].comment.slice(0, 10) + '..'
          }
        }
        /*
        for(var iter = 0; iter < rating_buf.length; iter ++)
        {
          rating_buf[iter].point = 5 - 1 * rating_buf[iter].point
        }
        */

        that.setData({
          booking: books,
          rating: rating_buf
        })
        var event_buf = res.data.result[0];
        event_buf.pic = app.globalData.uploadURL + event_buf.pic;
        if (event_buf.favourite_num == null) {
          event_buf.favourite_num = 0;
        }
        var register = res.data.result[0].current_member;
        if (register == null) {
          register = 0;
        }
        var time = event_buf.start_time.split(':');
        event_buf.start_time = time[0] + ':' + time[1];
        time = event_buf.end_time.split(':');
        event_buf.end_time = time[0] + ':' + time[1]
        if (event_buf.eventName.length > 15) {
          var name = event_buf.eventName
          name = name.slice(0, 15) + '..'
          event_buf.eventName = name
        }
        var now = Date.now()
        var canceltime = event_buf.start_time
        var tempdate
        tempdate = Date.parse(canceltime.replace(/-/g, '/'))
        if ((tempdate - now) < 21600000) {
          that.setData({ isshowcancel: 0 })
        }
        if (event_buf.state != 0) {
          wx.hideShareMenu()
        }
        that.setData({
          event: event_buf,
          id: id,
          register_num: register,
          favourite_num: res.data.favor[0],
        });
      }
    })
  },
  phone_call: function()
  {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.event.agent_phone,
      complete: function(){
        return
      }
    })
  },
  phone_call1: function (res) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.booking[res.currentTarget.id].phone,
      complete: function () {
        return
      }
    })
  },
  onShareAppMessage: function (res) {
    console.log("SHARED")
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: this.data.event.eventName,
      path: '/pages/index/detail_event/detail_event1?id=' + this.data.id + '&atype=1',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  show_preview: function () {
    var that = this
    wx.previewImage({
      urls: [that.data.event.pic],
    })
  },

  on_click_booking: function () {
    var that = this;
    wx.navigateTo({
      url: 'showmember?id=' + this.data.id,
    })
  },
  on_click_rating: function () {
    var that = this;
    wx.navigateTo({
      url: '../../other/comment/comment?id=' + that.data.id + '&kind=event',
    })
  },
  on_click_cancel_btn: function () {
    var that = this;
    wx.showModal({
      content: '是否取消蜂约？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.mainURL + 'api/cancelEvent',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              event_id: that.data.event.id
            },
            success: function (res) {
            }
          })
          wx.redirectTo({
            url: '../final_cancel/final_cancel?type=1',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        else if (res.cancel) {
        }
      }
    })
  },
})
