//index.js
//获取应用实例
const app = getApp()
var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var dtemp1, dtemp2
Page({
  data: {
    avatar: "",
    appid: 'wxea381fb0ca7c2a24', //appid needs to provide it yourself, here appid I randomly  
    secret: 'fengtiWeixin17642518820android12', //secret is required to provide, where the secret I wrote 
  },
  onLoad() {
  },
  onShow: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: app.globalData.mainURL + "api/getopenid",
          data: { code: res.code },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
          header: { 'content-type': 'application/json' }, // 设置请求的 header    
          success: function (res) {
            var obj = {};
            obj.openid = res.data.openid;
            obj.expires_in = Date.now() + res.data.expires_in;
            wx.setStorageSync('openid', res.data.openid);//存储openid 
            wx.setStorageSync('session_key', res.data.session_key)
            wx.getSetting({
              success: function (res) {
                if (res.authSetting['scope.werun'] != true) {
                  wx.authorize({
                    scope: 'scope.werun',
                  })
                }
                wx.getWeRunData({
                  success: function (res) {
                    var encryptedData = res.encryptedData;
                    var iv = res.iv;
                    var pc = new WXBizDataCrypt(that.data.appid, wx.getStorageSync('session_key'));
                    var data = pc.decryptData(encryptedData, iv)
                    app.globalData.step = data.stepInfoList.pop().step * 1
                    app.globalData.laststep = data.stepInfoList.pop().step * 1
                    console.log(app.globalData);
                    var todayfirst = wx.getStorageSync("todayfirst")
                    var tempdate2 = new Date()
                    if (todayfirst != tempdate2.getDate()) {
                      var tempdate = new Date()
                      wx.setStorageSync("todayselected", [])
                      wx.setStorageSync("daily_honey", [0, 0])
                      app.globalData.daily_honey = [0, 0]

                      var stephoney = (1 * app.globalData.laststep) * (app.globalData.rule[3].value * 1)
                      stephoney = 1 * Math.floor(stephoney)
                      var iter
                      if (stephoney != 0) {
                        if (stephoney >= app.globalData.rule[6].value * (app.globalData.userInfo.isVIP + 1)) {
                          stephoney = (app.globalData.rule[6].value * (app.globalData.userInfo.isVIP + 1))
                          app.globalData.honey_info.honeybox_array = []
                        }
                        else {
                          var temparray = app.globalData.honey_info.honeybox_array
                          var sum = stephoney
                          for (iter = temparray.length - 1; iter >= 0; iter--) {
                            if (sum + temparray[iter] < (app.globalData.rule[6].value * (app.globalData.userInfo.isVIP + 1))) {
                              sum = sum + temparray[iter]
                            }
                            else {
                              break;
                            }
                          }
                          if (temparray.length > 0 && iter >= 0) {
                            var last = temparray.slice(iter, iter + 1)
                            last[0].honey = (app.globalData.rule[6].value * (app.globalData.userInfo.isVIP + 1)) - sum
                            temparray = temparray.slice(iter, temparray.length - 1)
                            if (last[0].honey > 0) {
                              temparray.unshift(last[0])
                            }
                          }
                          app.globalData.honey_info.honeybox_array = temparray
                        }
                        var tempx, tempy
                        while (1) {
                          tempx = Math.floor((Math.random() * 100) % 9)
                          tempy = Math.floor((Math.random() * 100) % 3)
                          for (iter = 0; iter < app.globalData.honey_info.honeybox_array.length; iter++) {
                            if (tempx == app.globalData.honey_info.honeybox_array[iter].x && tempy == app.globalData.honey_info.honeybox_array[iter].y) {
                              break;
                            }
                          }
                          if (iter == app.globalData.honey_info.honeybox_array.length) {
                            break;
                          }
                        }

                        tempdate = Date.parse(new Date(tempdate.getFullYear(), tempdate.getMonth(), tempdate.getDate())) + 25200000
                        app.globalData.honey_info.honeybox_array.push({ x: tempx, y: tempy, honey: stephoney, start_time: tempdate })

                        wx.setStorageSync("honey_info", app.globalData.honey_info)
                        tempdate = new Date()
                        wx.setStorageSync("todayfirst", tempdate.getDate())
                        wx.request({
                          url: app.globalData.mainURL + 'api/setTodayFirst',
                          method: 'POST',
                          header: {
                            'content-type': 'application/json',
                          },
                          data: {
                            todayfirst: tempdate.getDate(),
                            user_id: app.globalData.userInfo.user_id
                          },
                          success: function () {
                            console.log('success')
                          }
                        })
                      }
                    }
                  },
                  fail: function (res) {
                  }
                })
              }
            })
          }
        })
      }
    })
    app.checkDate()
    var honey_info = wx.getStorageSync('honey_info')
    this.setData({
      total: app.globalData.honey_info.total_honey,
      honeybox_array: honey_info.honeybox_array,
      avatar: app.globalData.userInfo.avatar
    })
  },
  On_click_beeshop: function () {
    wx.navigateTo({
      url: 'mainbeeshop/mainbeeshop',
    })
  },
  On_click_beelist: function () {
    wx.navigateTo({
      url: 'transaction/transaction',
    })
  },
  On_click_comment: function () {
    wx.navigateTo({
      url: 'help/help',
    })
  },
  on_click_honey: function (event) {
    if (app.globalData.userInfo.user_id == 0) {
      return
    }
    if (app.globalData.isactivetime == 0) {
      wx.showToast({
        title: '从早上7点开始可以收集蜂蜜',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var selected = 0;
    var honey = 0;
    var honey_info = wx.getStorageSync('honey_info')
    console.log(honey_info.honeybox_array)
    for (var iter = 0; iter < honey_info.honeybox_array.length; iter++) {
      if (event.currentTarget.id * 1 == honey_info.honeybox_array[iter].start_time) {
        selected = iter
        console.log(event.currentTarget.id)
        console.log(honey_info.honeybox_array[selected].start_time)
        honey = honey_info.honeybox_array[iter].honey
        break
      }
    }
    if (app.globalData.daily_honey[1] >= app.globalData.rule[6].value) {
      var title = '您今天已经收获了' + app.globalData.rule[6].value + 'ml蜂蜜，明天再来哦'
      console.log(title)
      wx.showToast({
        title: title,
        icon: 'none'
      })
      return
    }
    else {
      if (app.globalData.daily_honey[1] + honey > app.globalData.rule[6].value) {
        honey_info.honeybox_array[selected].honey -= app.globalData.rule[6].value - app.globalData.daily_honey[1]
        honey = app.globalData.rule[6].value - app.globalData.daily_honey[1]
      }
      else {
        honey_info.honeybox_array.splice(selected, 1)
      }
      app.globalData.daily_honey[1] = app.globalData.daily_honey[1] * 1 + 1 * honey
      honey_info.total_honey = parseFloat(1 * honey) + parseFloat(honey_info.total_honey * 1);
      this.setData({
        honeybox_array: honey_info.honeybox_array
      })
      wx.setStorageSync('daily_honey', app.globalData.daily_honey)
      wx.setStorageSync('honey_info', honey_info)
      app.globalData.honey_info = honey_info
      wx.request({
        url: app.globalData.mainURL + 'api/catchHoney',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          no: 0,
          amount: honey_info.total_honey,
          honey: honey,
          user_id: app.globalData.userInfo.user_id,
          todayfirst: wx.getStorageSync('todayfirst'),
          daily_honey: JSON.stringify(wx.getStorageSync('daily_honey'))
        },
        success: function (res) {
        }
      })
      this.setData({
        total: app.globalData.honey_info.total_honey,
        honeybox_array: app.globalData.honey_info.honeybox_array
      })
    }
    console.log(app.globalData.honey_info.honeybox_array)
  }
})
