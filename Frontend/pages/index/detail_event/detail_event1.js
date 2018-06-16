//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    event: {
      start_time: '',
      end_time: '',
      province: '',
      area: '',
      city: '',
      detail_address: '',
      pic: ''
    },
    booking: [],
    eventType: [],
    userRole: [],
    eventState: [],
    is_full: false,
    is_registered: false,
    register_amount: 0,
    btn_text: '立即参加',
    rating: 0,
    rating_amount: 0,
  },
  onLoad: function (option) {
    var that = this;
    if (app.globalData.userInfo.user_id == 0) {
      app.onLaunch();
      setTimeout(function () {
        that.onInitStart(option);
      }, 4000);
    } else {
      that.onInitStart(option);
    }
  },
  onInitStart: function (option) {
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.setData({
      userInfo: app.globalData.userInfo,
      eventType: app.globalData.eventType,
      userRole: app.globalData.userRole,
      eventState: app.globalData.eventState
    });
    var id = option.id;
    var that = this;
    var user_id = app.globalData.userInfo.user_id
    if (user_id == 0) {
      user_id = -1
    }
    wx.request({
      url: app.globalData.mainURL + 'api/getEventDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'event_id': id,
        'user_id': user_id
      },
      success: function (res) {
        console.log(res.data.result[0])
        console.log(res.data.favor)
        var books = res.data.booking;
        var registered_num = 0;
        that.setData({
          favourite_num: 1 * res.data.result[0].favor_state
        })
        for (var index = 0; index < books.length; index++) {
          console.log(books[index].nickname)
          if (books[index].nickname == app.globalData.userInfo.nickname && 1 * books[index].state == 0) {
            that.setData({
              is_registered: true,
              is_disabled: true,
              btn_text: '已报名'
            })
            registered_num += 1 * books[index].reg_num;
          }
          else if (1 * books[index].state == 2) {
            if (books[index].nickname == app.globalData.userInfo.nickname) {
              that.setData({
                is_registered: true,
                is_disabled: true,
                btn_text: '已取消'
              })
            }
            books.splice(index, 1)
            index--;
          }
          else {
            registered_num += 1 * books[index].reg_num;
          }
        }
        that.setData({
          register_amount: registered_num
        })
        if (registered_num >= res.data.result[0].limit && that.data.btn_text == '立即参加') {
          that.setData({
            is_disabled: true,
            btn_text: '人数已满'
          })
        }
        for (var iter = 0; iter < books.length; iter++) {
          if (books[iter].name == null) {
            books[iter].name = books[iter].nickname
          }
        }
        that.setData({
          booking: books,
          rating: 1 * res.data.favor[0]
        })

        var event_buf = res.data.result[0];
        event_buf.pic = app.globalData.uploadURL + event_buf.pic;
        event_buf.favor_state = 1 * event_buf.favor_state

        if (event_buf.eventName.length > 15) {
          var name = event_buf.eventName
          name = name.slice(0, 15) + '..'
          event_buf.eventName = name
        }

        var time = event_buf.start_time.split(':');
        event_buf.start_time = time[0] + ':' + time[1];
        time = event_buf.end_time.split(':');
        event_buf.end_time = time[0] + ':' + time[1];
        event_buf.agent_phone = res.data.result[0].agent_phone
        wx.setNavigationBarTitle({
          title: app.globalData.eventType[event_buf.type] + '活动'
        })
        that.setData({
          event: event_buf,
          id: id
        });
        if (res.data.result[0].state == '1') {
          that.setData({
            is_disabled: true,
            btn_text: '活动已结束'
          })
        } else if (res.data.result[0].state == '2') {
          that.setData({
            is_disabled: true,
            btn_text: '活动已取消'
          })
        }
      }
    })
    //code for liseter paticipate
  },

  phone_call: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.event.agent_phone,
      complete: function () {
        return
      }
    })
  },
  set_preview: function () {
    var that = this
    wx.previewImage({
      urls: [that.data.event.pic],
      complete: function () {
        return
      }
    })
  },

  btn_Clicked_Personal_Input: function (event) {
    wx.navigateTo({
      url: '../personal_input/personal_input?id=' + event.currentTarget.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_Clicked_Gym_Info: function (event) {
    wx.navigateTo({
      url: '../detail_gym/detail_gym?id=' + event.currentTarget.id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  btn_Clicked_Favor: function () {
    var event_buff = this.data.favourite_num
    var rating = this.data.rating
    if (event_buff == 0) {
      event_buff = 1
      this.setData({ favourite_num: event_buff })
      this.data.rating++
      this.setData({ rating: this.data.rating })
    }
    else {
      event_buff = 0
      this.setData({ favourite_num: event_buff })
      this.data.rating--
      this.setData({ rating: this.data.rating })
    }
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/setFavouriteEvent',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'user_id': app.globalData.userInfo.user_id,
        'event_id': that.data.event.id
      },
      success: function (res) {
      }
    })
  },
  onShareAppMessage: function (res) {
    console.log("SHARED")
    if (res.from === 'button') {
      console.log(res.target)
    }
    var that = this;
    return {
      title: that.data.event.eventName,
      path: '/pages/index/detail_event/detail_event1?id=' + that.data.event.id
      + '&user_id=' + app.globalData.userInfo.user_id
      + '&nickname=' + app.globalData.userInfo.nickname
      + '&atype=1',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  }
})
