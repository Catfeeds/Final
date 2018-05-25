// pages/booking/bookingCancel.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_black_start_src: '../../../image/star_n@2x.png',
    img_yellow_start_src: '../../../image/star_s@2x.png',
    count_yellowStar: 3,
    booking: [],
    eventType: [],
    userRole: [],
    bookingState: [],
    register_num: 0,
    bookingcanceltime: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    this.setData({
      eventType: app.globalData.eventType,
      userRole: app.globalData.userRole,
      bookingState: app.globalData.eventState
    });
    var that = this;
    var id = query.id;

    wx.request({
      url: app.globalData.mainURL + 'api/getBookingDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'booking_id': id,
        'user_id': app.globalData.userInfo.user_id
      },
      success: function (res) {
        console.log(res)
        var book = res.data.result[0];
        if (book != null) {
          book.idshow = '0000000000'
          book.idshow = book.idshow.slice(0, 10 - book.id.length) + book.id
          var time = book.start_time.split(':');
          var register = res.data.register_num[0].register_num
          if (register == null) register = 0;
          book.start_time = time[0] + ':' + time[1];
          time = book.end_time.split(':')
          book.end_time = time[0] + ':'+ time[1]
          
          var now = Date.now()
          var replacetdate = book.start_time
          var tempdatenow
          tempdatenow = Date.parse(replacetdate.replace(/-/g, '/'))
          if ((tempdatenow - now) < 21600000) {
            that.setData({ bookingcanceltime : 0})
          }
          
          if (book.name.length > 12) {
            var name = book.name
            name = name.slice(0, 12) + '..'
            book.name = name
          }
          that.setData({
            booking: book,
            rating: res.data.rating,
            register_num: register
          })
          console.log(book.cost * book.reg_num)
        }
      }
    })
  },

  phone_call: function () {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.booking.agent_phone,
      complete: function () {
        return
      }
    })
  },
  final_cancel: function () {
    var that = this
    wx.showModal({
      content: '是否取消蜂约？',
      success: function (res) {
        if (res.confirm) {
          if (that.data.booking.pay_type == "1") {
            var ordercode = that.data.booking.cost * that.data.booking.reg_num;
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
                      out_trade_no: that.data.booking.out_trade_no,
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
                          booking_id: that.data.booking.id,
                          out_refund_no: out_refund_no
                        },
                        success: function (res) {

                          if (res.data.status == true) {
                            wx.navigateTo({
                              url: './booking',
                            })
                          }
                        }
                      })
                    }
                  })
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
                booking_id: that.data.booking.id,
              },
              success: function (res) {

                wx.navigateTo({
                  url: './booking',
                })
              }
            })
          }
        } else if (res.cancel) {
        }
      }
    })
  },
  //called when user wants to write comment
  btn_write_comment: function (event) {
    wx.navigateTo({
      url: '../../other/evaluation/evaluation?id=' + event.currentTarget.id,
    })
  }
})