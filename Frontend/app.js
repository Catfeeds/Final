//app.js
var WXBizDataCrypt = require('./utils/RdWXBizDataCrypt.js');

App({
  globalData: {
    appid: 'wxea381fb0ca7c2a24', //appid needs to provide it yourself, here appid I randomly  
    secret: 'fengtiWeixin17642518820android12', //secret is required to provide, where the secret I wrote 
    mch_id: '1500220062',
    userInfo: {
      'nickname': 'WeiXin',
      'avatar': '',
      'user_id': 0,
      'name': '',
      'phone': '',
      'honey': 0,
      'state': 0,
      'forbidden': 0,
      'isVIP': 0,
      eventData: { "ground_image": "", "act_type": "", "act_status": "", "favourite": 0, "act_name": "", "member_count": 0, "cost": 0, "act_date": " ", "address": "", "ground_name": "", "ground_owner": "", "max_member": 0, "act_intro": "" },
    },
    address: [],
    productState: ["待发货", "待收货", "交易成功"],
    eventState: ["进行中", "已完成", "已取消"],
    userRole: ['无', '场馆主', '个人'],
    eventType: ['足球', '篮球', '排球', '羽毛球', '乒乓球', '台球', '网球', '保龄球', '健身馆', '瑜伽', '游泳', '射击射箭', '跆拳道', '休闲桌游', '滑冰', '滑雪', '运动装备', '其他'],
    memberState: ['使用中', '已过期'],
    exchangeState: ['待发货', '待收货', '交易成功'],
    bindingState: ['提现中', '提现成功', '提现失败'],
    mainURL: 'https://www.fengteam.cn/backend/',
    smsURL: 'https://www.fengteam.cn/sms/SendTemplateSMS.php',
    uploadURL: 'https://www.fengteam.cn/backend/uploads/',
    // mainURL: 'https://127.0.0.1/honey/',
    // smsURL: 'https://www.fengteam.cn/sms/SendTemplateSMS.php',
    // uploadURL: 'https://127.0.0.1/honey/uploads/',
    honey_info: {
      total_honey: 0,
      honeybox_array: [],
    },
    daily_honey: [0, 0],
    isactivetime: 1,
    rule: '',
    step: 0,
    laststep: 0,
    see_news: 0,
    have_stadium: 0,
    issearch: 0,
    searchlat: 0,
    searchlong: 0,
    ischooseimage: 0,
    iscreatepage: 0,
    nickname_buf: ''
  },
  onLaunch: function () {
    wx.setTabBarStyle({
      color: '#888888',
      selectedColor: '#472E00',
      backgroundColor: '#ffffff'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
    wx.showLoading({
      title: '加载中',
    })
    //wx.setStorageSync("isfirstcreate", 1)
    //wx.setStorageSync("todayfirst", 0)
    /*wx.setStorageSync("todayselected", [])
    wx.setStorageSync("have_stadium", 0)
    wx.setStorageSync("honey_info", {
          total_honey: 0,
          honeybox_array: []
        })
    
    wx.setStorageSync("daily_honey", [0, 0])*/
    setTimeout(function () {
      wx.hideLoading()
    }, 3000)
    var _this = this
    wx.request({
      url: _this.globalData.mainURL + 'api/getRules',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        _this.globalData.rule = res.data.rule
      },
    })
    wx.login({
      success: function (res) {
        _this.globalData.user_code = res.code;
        wx.request({
          url: _this.globalData.mainURL + "api/getopenid",
          data: { code: _this.globalData.user_code },
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
                    var pc = new WXBizDataCrypt(_this.globalData.appid, wx.getStorageSync('session_key'));
                    var data = pc.decryptData(encryptedData, iv)
                    wx.setStorageSync('user_step', data.stepInfoList.pop().step * 1)
                    wx.setStorageSync('last_step', _this.globalData.laststep = data.stepInfoList.pop().step * 1)
                  }
                })
              }
            })
            wx.getUserInfo({
              success: function (res) {
                var info = _this.globalData.userInfo;
                info.nickname = res.userInfo.nickName;
                _this.globalData.nickname = info.nickname
                info.avatar = res.userInfo.avatarUrl;
                wx.request({
                  url: _this.globalData.mainURL + 'api/getUserStateByOpenId',
                  data: {
                    open_id: obj.openid
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {                    
                    if (res.data.status == false) {
                      wx.setStorageSync("todayfirst", 0)
                      wx.setStorageSync("todayselected", [])
                      wx.setStorageSync("honey_info", {
                        total_honey: 0,
                        honeybox_array: []
                      })
                      wx.setStorageSync("daily_honey", [0, 0])
                      wx.setStorageSync("favorinputtext", [])
                      wx.setStorageSync("have_stadium", 0)
                      wx.setStorageSync("isfirstcreate", 1)
                      setTimeout(function () {
                        _this.onLaunch();
                      }, 2000);
                      wx.request({
                        method: 'POST',
                        header: {
                          'content-type': 'application/json'
                        },
                        url: _this.globalData.mainURL + 'api/addNewUser',
                        data: {
                          nickname: _this.globalData.userInfo.nickname,
                          avatar: _this.globalData.userInfo.avatar,
                          open_id: obj.openid
                          // 'user_code': _this.globalData.user_code
                          // 'session_key': _this.globalData.session_key
                        },
                        success: function (ret) {
                          // if (ret.data.status) {
                          //   // var info = ret.data.result;
                          //   // //_this.globalData.userInfo;

                          //   // _this.globalData.userInfo.name = _this.globalData.userInfo.nickname
                          //   // _this.globalData.userInfo.user_id = info.user_id;
                          // }
                        }
                      })
                    }
                    else {
                      console.log(JSON.parse(res.data.result[0].daily_honey))
                      _this.globalData.honey_info = wx.getStorageSync('honey_info')
                      wx.setStorageSync("daily_honey", JSON.parse(res.data.result[0].daily_honey))
                      if(!wx.getStorageSync('todayfirst')){
                        wx.setStorageSync("todayfirst", res.data.result[0].todayfirst)
                      }
                      _this.globalData.daily_honey = JSON.parse(res.data.result[0].daily_honey)
                      _this.globalData.have_stadium = wx.getStorageSync("have_stadium")
                      if (_this.globalData.honey_info.honeybox_array == undefined) {
                        _this.globalData.honey_info = {
                          total_honey: 0,
                          honeybox_array: [],
                        }
                      }
                      _this.globalData.honey_info.total_honey = 1 * res.data.result[0].honey
                      wx.setStorageSync("honey_info", _this.globalData.honey_info)
                      var info = _this.globalData.userInfo;
                      if (res.data.result[0].forbidden == 1) {
                        wx.showModal({
                          title: '您的账号已被禁用',
                          showCancel: false,
                          complete: function () {
                            wx.navigateBackMiniProgram({
                            })

                          }
                        })
                      }
                      info.user_id = res.data.result[0].no;
                      info.phone = res.data.result[0].phone;
                      info.state = res.data.result[0].state;
                      info.forbidden = res.data.result[0].forbidden;
                      info.honey = res.data.result[0].honey;
                      _this.globalData.honey_info.total_honey = info.honey
                      wx.setStorageSync('honey_info', _this.globalData.honey_info)
                      info.role = res.data.result[0].role;
                      if (info.state * 1 != 2) {
                        info.name = _this.globalData.userInfo.nickname
                      }
                      if (info.avatar == '') {
                        info.avatar = "/image/user-unlogin.png"
                      }
                      if (res.data.member[0].state == null) {
                        info.isVIP = 0
                      }
                      if (res.data.member[0].state == 1) {
                        info.isVIP = 1;
                      }
                      _this.globalData.userInfo = info
                      var tempdate1 = new Date()
                      if (tempdate1.getHours() >= 0 && tempdate1.getHours() < 7) {
                        _this.globalData.isactivetime = 0
                      }
                      else {
                        _this.globalData.isactivetime = 1
                      }
                      setInterval(_this.checkDate, 1000)
                    }
                  },
                  fail: function () {
                  }
                })
              }
            });
          }
        });

      }
    })
    this.globalData.userInfo.nickname = this.globalData.nickname
  },
  onHide: function () {
    wx.setStorageSync('honey_info', this.globalData.honey_info)
  },
  showHint: function () {
    wx.showModal({
      title: '提示',
      content: '开启微信计步权限，有机会获取蜂蜜哦',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({

          })
          //跳转去设置
        }
      }
    })
  },
  resethoney: function () {

  },
  checkDate: function () {
    var _this = this
    var tempdate = new Date()
    if (tempdate.getHours() < 7) {
      this.globalData.isactivetime = 0
      var todaytime = new Date().getDate()

      wx.setStorageSync("todayselected", [])
      _this.globalData.daily_honey = [0, 0]
      wx.setStorageSync("daily_honey", [0, 0])
    }
    if (tempdate.getHours() >= 7) {
      this.globalData.isactivetime = 1
      var that = this
    }

    var that = this
    wx.request({
      url: that.globalData.mainURL + 'api/getNewBookingAlarm',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        user_id: that.globalData.userInfo.user_id
      },
      success: function (res) {
        if (res.data.bookingNewsAmount.length > 0) {
          for (var iter = 0; iter < res.data.bookingNewsAmount.length; iter++) {
            var booking_data = res.data.bookingNewsAmount[iter]
            that.gainNewHoney(booking_data)
          }
        }
      },
    })
    for (var iter = 0; iter < this.globalData.honey_info.honeybox_array.length; iter++) {
      if (Date.now() - this.globalData.honey_info.honeybox_array[iter].start_time > 172800000) {
        this.globalData.honey_info.honeybox_array.splice(iter, 1)
      }
    }
  },

  gainNewHoney: function (booking_data) {
    var _this = this
    var iter;
    var tempx, tempy
    var honeytype = 1
    var vip = _this.globalData.userInfo.isVIP + 1
    var daily_honey = wx.getStorageSync("daily_honey")
    if (daily_honey == '') daily_honey = [0, 0];
    _this.globalData.daily_honey = daily_honey
    if (true || _this.globalData.daily_honey[1] <= _this.globalData.rule[6].value) {
      if (booking_data.role == 1) {
        var unit = _this.globalData.rule[0].value * 1;
        var portion = _this.globalData.rule[4].value * 1;
        var honey = unit / (portion + 1) * booking_data.amount;
        honey = Math.floor(honey)
        if (honey >= (_this.globalData.rule[6].value * vip)) {
          honey = (_this.globalData.rule[5 + honeytype].value * 1)
          _this.globalData.honey_info.honeybox_array = []
        }
        else {
          var temparray = _this.globalData.honey_info.honeybox_array
          var sum = honey
          for (iter = temparray.length - 1; iter >= 0; iter--) {
            if (sum + temparray[iter] < (_this.globalData.rule[6].value * vip)) {
              sum = sum + temparray[iter]
            }
            else {
              break;
            }
          }
          if (temparray.length > 0 && iter >= 0) {
            var last = temparray.splice(iter, iter + 1)
            last[0].honey = _this.globalData.rule[6].value * vip - sum
            temparray.splice(0, iter)
            if (last[0].honey > 0) {
              temparray.unshift(last[0])
            }
          }
          _this.globalData.honey_info.honeybox_array = temparray
        }
        while (1) {
          tempx = Math.floor((Math.random() * 100) % 9)
          tempy = Math.floor((Math.random() * 100) % 3)
          for (iter = 0; iter < _this.globalData.honey_info.honeybox_array.length; iter++) {
            if (tempx == _this.globalData.honey_info.honeybox_array[iter].x && tempy == _this.globalData.honey_info.honeybox_array[iter].y) {
              break;
            }
          }
          if (iter == _this.globalData.honey_info.honeybox_array.length) {
            break;
          }
        }
        var tempdate
        tempdate = Date.parse(booking_data.end_time.replace(/-/g, '/'))
        _this.globalData.honey_info.honeybox_array.push({ x: tempx, y: tempy, honey: honey, start_time: tempdate })
        wx.setStorageSync("honey_info", _this.globalData.honey_info)
      }
      if (booking_data.role == 2) {
        if (booking_data.additional == 1) {
          //} && _this.globalData.daily_honey[1] < _this.globalData.rule[6].value) {
          var unit = _this.globalData.rule[1].value * 1;
          var portion = _this.globalData.rule[4].value * 1;
          var honey = unit * booking_data.amount / (portion + 1);
          honey = Math.floor(honey)
          if (honey >= _this.globalData.rule[6].value * vip) {
            honey = _this.globalData.rule[6].value * vip
            _this.globalData.honey_info.honeybox_array = []
          }
          else {
            var temparray = _this.globalData.honey_info.honeybox_array
            var sum = honey
            for (iter = temparray.length - 1; iter >= 0; iter--) {
              if (sum + temparray[iter].honey <= (_this.globalData.rule[6].value * vip)) {
                sum = sum + temparray[iter].honey
              }
              else {
                break;
              }
            }
            if (temparray.length > 0 && iter >= 0) {
              var last = temparray.splice(iter, 1)
              last[0].honey = _this.globalData.rule[6].value * vip - sum
              temparray.splice(0, iter)
              if (last[0].honey > 0) {
                temparray.unshift(last[0])
              }
            }
            _this.globalData.honey_info.honeybox_array = temparray
          }
          while (1) {
            tempx = Math.floor((Math.random() * 100) % 9)
            tempy = Math.floor((Math.random() * 100) % 3)
            for (iter = 0; iter < _this.globalData.honey_info.honeybox_array.length; iter++) {
              if (tempx == _this.globalData.honey_info.honeybox_array[iter].x && tempy == _this.globalData.honey_info.honeybox_array[iter].y) {
                break;
              }
            }
            if (iter == _this.globalData.honey_info.honeybox_array.length) {
              break;
            }
          }
          var tempdate
          tempdate = Date.parse(booking_data.end_time.replace(/-/g, '/'))
          _this.globalData.honey_info.honeybox_array.push({ x: tempx, y: tempy, honey: honey, start_time: tempdate })
          wx.setStorageSync("honey_info", _this.globalData.honey_info)
        }
      }
    }
    wx.setStorageSync("honey_info", _this.globalData.honey_info)
  }
})