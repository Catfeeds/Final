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
    booking: [],
    selectedtab: 0,
    eventType: [],
    userRole: [],
    bookingState: [],
    register_num: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      userInfo: app.globalData.userInfo,
      eventType: app.globalData.eventType,
      userRole: app.globalData.userRole,
      bookingState: app.globalData.eventState
    });
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/getMyBooking',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'user_id': app.globalData.userInfo.user_id
      },
      success: function (res) {
        if(res.data.status == false) return
        console.log(res)
        var book = res.data.result;
        if (book != null) {
          for (var index = 0; index < book.length; index++) {
            var tempdate
            tempdate = Date.parse(book[index].start_time.replace(/-/g, '/'))
            if (tempdate - Date.now() < 21600000) {
              book[index].isbtn = 0
            }
            else {
              book[index].isbtn = 1
            }
            if (book[index].favor_state == null) {
              book[index].favor_state = 0;
              book[index].idshow = '0000000000'
              book[index].idshow = book[index].idshow.slice(0, 10 - book[index].id.length) + book[index].id
            }
            if (book[index].name.length > 12) {
              var name = book[index].name
              name = name.slice(0, 12) + '..'
              book[index].name = name
            }
            var time = book[index].start_time.split(':');
            book[index].start_time = time[0] + ':' + time[1];

            var time1 = book[index].end_time.split(':');
            book[index].end_time = time1[0] + ':' + time1[1];
            that.data.booking = book
            that.data.register_num = res.data.register_num
          }
          that.showevent(0)
        }
      }
    })
  },
  showevent: function (tabtype) {
    var book = this.data.booking
    var register_num = this.data.register_num
    if(book == null) return
    if(book.length < 2)
    {
      this.setData({
        booking: book,
      })
      return;
    }
    var temp
    console.log(book[0].start_time > book[1].start_time)
    if(tabtype == 0)
    {
      for (var i = 0; i < book.length - 1; i++) {
        for (var j = i + 1; j < book.length; j++) {
          if (book[i].start_time < book[j].start_time) {
            temp = book[i]
            book[i] = book[j]
            book[j] = temp
            temp = register_num[i]
            register_num[i] = register_num[j]
            register_num[j] = temp
          }
        }
      }
    }
    if(tabtype == 1)
    {
      for (var i = 0; i < book.length - 1; i++) {
        for (var j = i + 1; j < book.length; j++) {
          if (book[i].end_time < book[j].end_time) {
            temp = book[i]
            book[i] = book[j]
            book[j] = temp
            temp = register_num[i]
            register_num[i] = register_num[j]
            register_num[j] = temp
          }
        }
      }
    }
    this.setData({
      booking: book,
      register_num: register_num
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
        this.setData({ selectedtab: 0 });
        this.showevent(0)
        break;
      case "btn2":
        this.setData({ active2: "active" });
        this.setData({ selectedtab: 1 });
        this.showevent(1)
        break;
      case "btn3":
        this.setData({ active3: "active" });
        this.setData({ selectedtab: 2 });
        this.showevent(2)
        break;
    }
    console.log(this.data.register_num[0])
  },
  //called when user clicked cancel event button.
  btn_remove_booking: function (event) {
    var no = event.currentTarget.id
    var that = this

    wx.showModal({
      content: '是否取消蜂约？',
      success: function (res) {
        if (res.confirm) {

          if (that.data.booking[no].pay_type == "1") {
            var ordercode = that.data.booking[no].cost * that.data.booking[no].reg_num;
            var out_refund_no = app.globalData.mch_id + Date.now()

            wx.login({
              success: function (res) {
                if (res.code) {
                  wx.request({
                    url: app.globalData.mainURL + 'api/refund',
                    data: {
                      id: wx.getStorageSync('openid'),//要去换取openid的登录凭证
                      fee: ordercode,
                      user_id: app.globalData.userInfo.user_id,
                      out_trade_no: that.data.booking[no].out_trade_no,
                      out_refund_no: out_refund_no
                    },
                    method: 'POST',
                    header:
                    {
                      'content-type': 'application/json'
                    },
                    success: function (res) {

                      wx.request({
                        url: app.globalData.mainURL + 'api/cancelBooking',
                        method: 'POST',
                        header:
                        {
                          'content-type': 'application/json'
                        },
                        data: {
                          booking_id: that.data.booking[no].id,
                          out_refund_no: out_refund_no
                        },
                        success: function (res) {

                          if (res.data.status == true) {
                            var booking = that.data.booking;
                            booking[no].out_refund_no = out_refund_no
                            booking[no].state = 2
                            that.setData({
                              booking: booking
                            })
                          }
                        }
                      })
                    }
                  })
                  that.onLoad()
                } else {
                }
              }
            });
          }
          else {
            wx.request({
              url: app.globalData.mainURL + 'api/cancelBooking',
              method: 'POST',
              header:
              {
                'content-type': 'application/json'
              },
              data: {
                booking_id: that.data.booking[no].id,
              },
              success: function (res) {

                if (res.data.status == true) {
                  var booking = that.data.booking;
                  booking[no].out_refund_no = out_refund_no
                  booking[no].state = 2
                  that.setData({ booking: booking })
                }
              }
            })
          }
        } else if (res.cancel) {
        }
      }
    })
  },
  //called when user wants to see detail
  click_detail_event: function (event) {
    wx.navigateTo({
      url: 'booking_detail?id=' + event.currentTarget.id,
    })
  },
  //called when user wants to write comment
  btn_write_comment: function (event) {
    wx.navigateTo({
      url: '../../other/evaluation/evaluation?id=' + event.currentTarget.id,
    })
  }
})