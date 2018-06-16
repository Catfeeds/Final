const app = getApp()

Page({
  data: {
    nickname: "",
    user_avatar: "",
    event: [],
    realname: "",
    phonenumber: 0,
    memcount: 0,
    totalcost: 0,
    register_num: 0,
    id: 0,
    pay_type: 1,
    btnstrarray: ["确认参加", "确认支付"],
    isfirstbtn: 0,
  },
  onLoad: function (param) {
    var that = this;
    that.setData({
      nickname: app.globalData.userInfo.nickname,
      user_avatar: app.globalData.userInfo.avatar
    })
    var id = param.id;
    this.setData({ btnstr: this.data.btnstrarray[1] })
    if(!app.globalData.userInfo.user_id){
      wx.showModal({
        title: '获取用户信息失败',
        content:'由于无法获取您的信息，所以您无法使用参加活动等功能',
        showCancel: false,
        complete: function (res) {
          wx.switchTab({
            url: '../../activity/activity',
            success: function () {
              wx.showTabBar({
              })
            }
          })
        }
      })
      return;
    }
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
        console.log(res)
        var event_buf = res.data.result[0]
        var time = event_buf.start_time.split(':');
        event_buf.start_time = time[0] + ':' + time[1];
        time = event_buf.end_time.split(':');
        event_buf.end_time = time[0] + ':' + time[1];
        if (res.data.result[0].current_member == null)
          that.data.register_num = 0
        else
          that.data.register_num = res.data.result[0].current_member
        if (event_buf.start_time == undefined) {
          event_buf.start_time = ""
        }
        if (event_buf.end_time == undefined) {
          event_buf.end_time = ""
        }
        if (event_buf.province == "NaN" || event_buf.city == 'NaN' || event_buf.area == 'NaN' || event_buf.detail_address == 'NaN') {
          event_buf.province = ''
          event_buf.city = ' '
          event_buf.area = ' '
          event_buf.detail_address = ''
        }
        console.log(event_buf)
        that.setData({
          event: event_buf,
          id: id
        });
      }
    })
  },
  on_Input_Realname: function (event) {
    this.setData({ realname: event.detail.value });
  },
  on_Input_Phonenumber: function (event) {
    this.setData({ phonenumber: event.detail.value });
  },
  on_Input_Memcount: function (event) {
    this.setData({ memcount: event.detail.value });
    var cost = (1 * event.detail.value) * (1 * this.data.event.cost)
    if (cost == 0) {
      this.setData({ total_cost: 0 })
    }
    else {
      this.setData({ total_cost: cost.toFixed(2) })
    }
  },
  on_Btn_OK: function () {
    var x = 0
    if (this.data.realname.length == 0) {
      x++
      wx.showToast({
        title: '请填写真实姓名',
        icon: 'none'
      })
      return
    }
    if (this.data.realname.length > 4) {
      x++
      wx.showToast({
        title: '姓名应不超过4个字',
        icon: 'none'
      })
      return
    }
    if (this.data.phonenumber.length == 0) {
      x++
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return
    }
    if (this.data.phonenumber.length != 11) {
      x++
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
      return
    }
    if (this.data.memcount * 1 > (this.data.event.limit - this.data.register_num)) {
      x++
      wx.showToast({
        title: '总报名人数超过活动人数上限',
        icon: 'none'
      })
      return
    }
    if (this.data.memcount == 0) {
      x++
      wx.showToast({
        title: '请填写报名人数',
        icon: 'none'
      })
      return
    }
    if (this.data.isfirstbtn == 1) return;
    else if (this.data.isfirstbtn == 0) {
      this.data.isfirstbtn = 1
    }
    if (x == 0 && this.data.event.role != 2) {
      var that = this
      if (that.data.pay_type == 1 && that.data.event.cost != 0) {
        console.log(that.data.event.cost)
        var ordercode = that.data.event.cost * 1 * that.data.memcount;
        var out_trade_no = app.globalData.mch_id + Date.now() + (10000 + Math.floor(Math.random() * 90000))
        console.log(ordercode)
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.request({
                url: app.globalData.mainURL + 'api/pay',
                data: {
                  id: wx.getStorageSync('openid'),//要去换取openid的登录凭证
                  fee: ordercode,
                  user_id: app.globalData.userInfo.user_id,
                  out_trade_no: out_trade_no
                },
                method: 'POST',
                header:
                {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  wx.requestPayment({
                    timeStamp: res.data.timeStamp,
                    nonceStr: res.data.nonceStr,
                    package: res.data.package,
                    signType: 'MD5',
                    paySign: res.data.paySign,
                    success: function (res) {
                      if (res.errMsg.length <= 20) {
                        wx.request({
                          url: app.globalData.mainURL + 'api/addBooking',
                          method: 'POST',
                          header: {
                            'content-type': 'application/json'
                          },
                          data: {
                            user_id: app.globalData.userInfo.user_id,
                            event_id: that.data.event.id,
                            reg_num: that.data.memcount,
                            pay_type: 1,
                            out_trade_no: out_trade_no,
                            role: that.data.event.role,
                            phone: that.data.phonenumber,
                            name: that.data.realname,
                          },
                          success: function (res) {
                            wx.redirectTo({
                              url: '../../profile/final_cancel/final_cancel?type=2'
                            })
                          }
                        })
                      }
                    },
                    fail: function (res) {
                      // fail
                    },
                    complete: function (res) {
                      that.data.isfirstbtn = 0
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
          url: app.globalData.mainURL + 'api/addBooking',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            user_id: app.globalData.userInfo.user_id,
            event_id: that.data.event.id,
            reg_num: that.data.memcount,
            pay_type: that.data.pay_type,
            role: app.globalData.userInfo.role,
            phone: that.data.phonenumber,
            name: that.data.realname,
          },
          success: function (res) {
            wx.redirectTo({
              url: '../../profile/final_cancel/final_cancel?type=2',
              success: function () {
                that.data.isfirstbtn = 0
              }
            })
          }
        })
      }
    }
    else {
      var that = this
      wx.request({
        url: app.globalData.mainURL + 'api/addBooking',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: app.globalData.userInfo.user_id,
          event_id: that.data.event.id,
          reg_num: that.data.memcount,
          role: app.globalData.userInfo.role,
          phone: that.data.phonenumber,
          name: that.data.realname,
          pay_type: 0,
        },
        success: function (res) {
          wx.redirectTo({
            url: '../../profile/final_cancel/final_cancel?type=2',
            success: function () {
              that.data.isfirstbtn = 0
            }
          })
        }
      })
    }
  },
  on_click_payway: function (e) {
    var x = 1 * e.detail.value
    this.setData({ btnstr: this.data.btnstrarray[x] })
    this.data.pay_type = e.detail.value
  }
})
