// pages/booking/booking.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active1: "active",
    active2: "",
    active3: "",
    bookingArray: new Array(),
    selectedtab: "booked",
    events: [],
    selected_state: 0,
    userInfo: [],
    eventType: [],
    userRole: [],
    eventState: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      userInfo: app.globalData.userInfo,
      eventType: app.globalData.eventType,
      userRole: app.globalData.userRole,
      eventState: app.globalData.eventState
    });
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/getAllEvents',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'user_id': app.globalData.userInfo.user_id
      },
      success: function (res) {

        var event_buf = res.data.result;
        console.log(res)
        if (event_buf != null) {
          for (var index = 0; index < event_buf.length; index++) {
            var tempdate
            tempdate = Date.parse(event_buf[index].start_time.replace(/-/g, '/'))
            if (tempdate - Date.now() < 21600000) {
              event_buf[index].isbtn = 0
            }
            else {
              event_buf[index].isbtn = 1
            }
            event_buf[index].avatar = app.globalData.uploadURL + event_buf[index].pic;

            var time = event_buf[index].start_time.split(':');
            event_buf[index].start_time = time[0] + ':' + time[1];
            
            var time1 = event_buf[index].end_time.split(':');
            event_buf[index].end_time = time1[0] + ':' + time1[1];

            if (event_buf[index].register_num == null) {
              event_buf[index].register_num = 0;
            }
            if(event_buf[index].name.length>10)
            {
              var name =  event_buf[index].name
              name = name.slice(0,10) + '..'
              event_buf[index].name = name
            }
            that.data.events = event_buf
          }
          that.showarray(0)
        }
      }
    })
  },
  showarray(tabtype = 0)
  {
    var event_buf = this.data.events
    if (event_buf == null) return
    if (event_buf.length < 2) {
      this.setData({
        events: event_buf,
      })
      return
    }
    var temp
    if (tabtype == 0) {
      for (var i = 0; i < event_buf.length - 1; i++) {
        for (var j = i + 1; j < event_buf.length; j++) {
          if (event_buf[i].start_time < event_buf[j].start_time) {
            temp = event_buf[i]
            event_buf[i] = event_buf[j]
            event_buf[j] = temp
          }
        }
      }
    }
    if (tabtype == 1) {
      for (var i = 0; i < event_buf.length - 1; i++) {
        for (var j = i + 1; j > event_buf.length; j++) {
          if (event_buf[i].end_time < event_buf[j].end_time) {
            temp = event_buf[i]
            event_buf[i] = event_buf[j]
            event_buf[j] = temp
          }
        }
      }
    }
    this.setData({
      events: event_buf,
    })
  },
  /**
 * This function is called after user select one of the tabs
 */

  selectTab: function (event) {
    this.setData({ active1: " " });
    this.setData({ active2: " " });
    this.setData({ active3: " " });
    switch (event.currentTarget.id) {
      case "btn1":
        this.setData({ active1: "active" });
        this.setData({ selected_state: 0 });
        this.showarray(0)
        break;
      case "btn2":
        this.setData({ active2: "active" });
        this.setData({ selected_state: 1 });
        this.showarray(1)
        break;
      case "btn3":
        this.setData({ active3: "active" });
        this.setData({ selected_state: 2 });
        this.showarray(2)
        break;
    }
  },
  //called when user clicked cancel event button.
  btn_remove_booking: function (event) {
    var index = event.target.id;
    var that = this;
    wx.showModal({
      content: '是否取消活动？',
      success: function (res) {
        if (res.confirm) {
          var now = Date.now()
          var tempdate
          tempdate = Date.parse(that.data.events[index].start_time.replace(/-/g, '/'))
          if ((tempdate - now) < 86400) {
            wx.showToast({
              title: '现在距离活动开始时间已不到24小时，无法取消活动',
              icon: 'none',
              time: 3000
            })
            return;
          }
          wx.request({
            url: app.globalData.mainURL + 'api/cancelEvent',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              event_id: that.data.events[index].id
            },
            success: function (res) {
              var event = that.data.events
              event[index].state = 2
              that.setData({
                events: event
              })

              wx.redirectTo({
                url: '../final_cancel/final_cancel?type=1',
                success: function (res) { 
                  var ret = res;
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
          })

        } else if (res.cancel) {
        }
      }
    })
  },
  //called when user wants to see detail
  click_detail_event: function (event) {
    wx.navigateTo({
      url: 'eventdetail?id=' + event.currentTarget.id,
    })
  },
  //called when user wants to write comment
  btn_write_comment: function (event) {
    wx.navigateTo({
      url: '../../evaluation/evaluation',
    })
  }
})