var dateTimePicker = require('../../../utils/datetimePicker.js');
var app = getApp();

Page({
  data: {
    member_state: 0,
    role: 1,
    publicity: 1,
    event: {
      name: "",
      kind: 20,
      agent_name: "",
      agent_phone: "",
      start_time: "",
      end_time: "",
      address4: "",
      limit: "",
      cost: 0,
      event_pic: "../../../image/fengm@2x.png",
      comment: "",
      publicity: 1,
      additional: 1,
      showModal1: false,
      showModal2: false,
      textareastr: "",
      placestr: "请输入活动简介，不超过500字",
    },
    eventpic: "../../../image/fengm@2x.png",
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    eventType: [],
    overimagecount: 0,
    longitude: 0,
    latitude: 0,
    province: [],
    city: [],
    area: [],
    select_province: 0,
    select_city: 0,
    select_area: 0,
    role: 1,
    open: false,
    city_id: 0,
    province_id: 0,
    area_id: 0,
    province_name: "",
    city_name: "",
    area_name: "",
    province_id: 0,
    area_id: 0,
    city_id: 0,
    select_position_text: '',
    showdetailaddress: 1,
    isvip: 0,
    lawstr: "",
    isfirstbtn: 0,
    is_cross: 0
  },

  onLoad: function (params) {
    this.setData({ textareastr: "" })
    var that = this
    this.setData({ placestr: "请输入活动简介，不超过500字" })

    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    wx.request({
      url: app.globalData.mainURL + 'api/getRules',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        app.globalData.rule = res.data.rule
        console.log(app.globalData.rule)
      },
    })
    console.log(app.globalData.rule)
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      honey: app.globalData.rule[8].value
    });

    this.setData({ isshow: 1 })
    if (app.globalData.detailaddress != undefined)
      this.setData({ detailaddress: app.globalData.detailaddress })
    this.data.longitude = app.globalData.longitude
    this.data.latitude = app.globalData.latitude

    this.setData({
      role: app.globalData.userInfo.role,
      eventType: app.globalData.eventType
    })
    var _this = this
    wx.hideTabBar({
    })
    wx.request({
      url: app.globalData.mainURL + 'api/getProvinces',
      success: function (res) {
        var tempprovince = res.data.result
        tempprovince.unshift({ id: "0", province: "请选择省" })
        _this.setData({
          province: tempprovince,
          select_province: 0,
          city: [{ id: "0", city: "请选择市" }],
          select_city: 0,
          area: [{ id: "0", area: "请选择区" }],
          select_area: 0,
          member_state: app.globalData.userInfo.isVIP
        })
      }
    })
    wx.request({
      url: app.globalData.mainURL + 'api/getUserState',
      data: {
        'nickname': app.globalData.userInfo.nickname
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status) {
          that.setData({
            role: res.data.result[0].role
          })
          if (that.data.role == "1") {
            wx.request({
              url: app.globalData.mainURL + 'api/getUserDetail',
              data: {
                user_id: app.globalData.userInfo.user_id
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                that.setData({
                  province_name: res.data.result[0].province,
                  city_name: res.data.result[0].city,
                  area_name: res.data.result[0].area,
                  province_id: res.data.result[0].province_id,
                  city_id: res.data.result[0].city_id,
                  area_id: res.data.result[0].area_id,
                  detail_address: res.data.result[0].detail_address,
                  showdetailaddress: 0
                })
                _this.data.event.address4 = res.data.result[0].detail_address
              }
            })
          }
        }
      }
    })

  },
  onReady: function () {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () { // Do a delay retries as a guarantee.
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  onShow: function () {
    app.globalData.iscreatepage = 1
    var that = this
    that.data.is_cross = 0
    wx.request({
      url: app.globalData.mainURL + 'api/getUserState',
      method: 'post',
      data: {
        'nickname': app.globalData.userInfo.nickname
      },
      success: function (res) {
        app.globalData.userInfo.state = res.data.result[0].state
        if (app.globalData.userInfo.state == 0) {
          wx.showModal({
            title: '提示',
            content: '请先进行身份认证',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../profile/auth/auth',
                })
                that.data.is_cross = 1
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../../index/index',
                  success: function () {
                    wx.showTabBar({
                    })
                  }
                })
              }
            },
            complete: function () {
              if (that.data.is_cross == 0)
                wx.switchTab({
                  url: '../../index/index',
                  success: function () {
                    wx.showTabBar({
                    })
                  }
                })
            }
          })
          return;
        }
        if (app.globalData.userInfo.state == 3) {
          wx.showModal({
            title: '提示',
            content: '您的身份认证审核未通过，请重新提交',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../profile/auth/auth',
                })
                that.data.is_cross = 1
              }
              else if (res.cancel) {
                wx.switchTab({
                  url: '../../index/index',
                  success: function () {
                    wx.showTabBar({

                    })
                  }
                })
              }
            },
            complete: function () {
              if (that.data.is_cross == 0)
                wx.switchTab({
                  url: '../../index/index',
                  success: function () {
                    wx.showTabBar({

                    })
                  }
                })
            }
          })
          return;
        }
        if (app.globalData.userInfo.state == 1) {
          wx.showModal({
            title: '提示',
            content: '您的认证资料已提交，请等待审核通过',
            showCancel: false,
            complete: function () {
              wx.switchTab({
                url: '../../index/index',
                success: function () {
                  wx.showTabBar({

                  })
                }
              })
            }
          })
          return;
        }
        var have_stadium = wx.getStorageSync("have_stadium")
        if (have_stadium == 0 && 1 * app.globalData.userInfo.role == 1) {
          wx.showModal({
            title: '提示',
            content: '请填写场馆资料',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../profile/register_stadium/register_stadium',
                  success: function () {
                    wx.showTabBar({
                    })
                  }
                })
                that.data.is_cross = 1
              }
              else if (res.cancel) {
                wx.switchTab({
                  url: '../../index/index',
                  success: function () {
                    wx.showTabBar({
                    })
                  }
                })
              }
            },
            complete: function () {
              if (that.data.is_cross == 0)
                wx.switchTab({
                  url: '../../index/index',
                  success: function () {
                    wx.showTabBar({

                    })
                  }
                })
            }
          })
        }
      }
    })
  },
  navigateBack: function () {
    console.log("OKBACK")
  },
  showitem: function () {
    this.setData({
      open: !this.data.open,
      showModal2: true
    })
  },
  on_click_type: function (e) {
    var _this = this
    _this.data.event.kind = e.currentTarget.id;
    _this.setData({
      event: _this.data.event,
      showModal2: false
    })
  },
  On_blur_detailaddress: function (e) {
    this.data.event.address4 = e.detail.value;
  },
  on_blur_limit: function (e) {
    this.data.event.limit = e.detail.value;
  },
  on_blur_cost: function (e) {
    this.data.event.cost = e.detail.value;
  },
  on_blur_comment: function (e) {
    this.data.event.comment = e.detail.value;
  },
  on_event_name: function (e) {
    this.data.event.name = e.detail.value;
  },
  on_agent_name: function (e) {
    this.data.event.agent_name = e.detail.value;
  },
  on_agent_phone: function (e) {
    this.data.event.agent_phone = e.detail.value;
  },
  On_click_registerimage: function (e) {
    var _this = this;
    app.globalData.ischooseimage = 1
    wx.chooseImage({
      count: 1,
      success: function (res) {
        if (res.tempFiles[0].size > 5120000) {
          _this.data.overimagecount++;
        }
        _this.data.event.event_pic = res.tempFilePaths[0];
        _this.setData({ eventpic: res.tempFilePaths[0] })
      },
    })
  },

  On_click_map: function (e) {
    var that = this
    app.globalData.ischooseimage = 1
    wx.chooseLocation({
      success: function(res) {
        that.data.longitude = res.longitude
        that.data.latitude = res.latitude
        that.setData({
          select_position_text: "已选择"
        })
      },
      complete: function(res){
        console.log(res)
      }
    })
    /*
    wx.chooseLocation({
      success: function (res) {
        that.data.longitude = res.longitude
        that.data.latitude = res.latitude
        that.setData({
          select_position_text: "已选择"
        })
      },
      fail(res)
      {
      }
    })
    */
  },
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    var _this = this
    _this.setData({
      dateTime: e.detail.value
    })
    _this.data.event.end_time = "" + _this.data.dateTimeArray[0][_this.data.dateTime[0]] + '-' + _this.data.dateTimeArray[1][_this.data.dateTime[1]] + '-' + _this.data.dateTimeArray[2][_this.data.dateTime[2]] + ' ' + _this.data.dateTimeArray[3][_this.data.dateTime[3]] + ':' + _this.data.dateTimeArray[4][_this.data.dateTime[4]];

    _this.setData({
      event: _this.data.event
    });
  },
  changeDateTime1(e) {
    var _this = this
    _this.setData({
      dateTime1: e.detail.value
    })
    _this.data.event.start_time = "" + _this.data.dateTimeArray1[0][_this.data.dateTime1[0]] + '-' + _this.data.dateTimeArray1[1][_this.data.dateTime1[1]] + '-' + _this.data.dateTimeArray1[2][_this.data.dateTime1[2]] + ' ' + _this.data.dateTimeArray1[3][_this.data.dateTime1[3]] + ':' + _this.data.dateTimeArray1[4][_this.data.dateTime1[4]];

    _this.setData({
      event: _this.data.event
    });
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr
    });
  },
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  radioChange: function (e) {
    var _this = this
    _this.data.event.publicity = e.detail.value
    _this.setData({
      event: _this.data.event,
      publicity: e.detail.value
    })
  },
  radioChange1: function (e) {
    var _this = this
    _this.data.event.additional = e.detail.value
    _this.setData({
      event: _this.data.event
    })
  },
  on_cancel: function () {
    wx.switchTab({
      url: '../../index/index',
      success: function () {
        wx.showTabBar({
        })
      }
    })
  },
  on_submit: function () {
    var _this = this
    if (app.globalData.userInfo.role == 2) {
      this.data.province_id = this.data.province[this.data.select_province].id
      this.data.city_id = this.data.city[this.data.select_city].id
      this.data.area_id = this.data.area[this.data.select_area].id
    }
    _this.data.event.start_time = "" + _this.data.dateTimeArray1[0][_this.data.dateTime1[0]] + '-' + _this.data.dateTimeArray1[1][_this.data.dateTime1[1]] + '-' + _this.data.dateTimeArray1[2][_this.data.dateTime1[2]] + ' ' + _this.data.dateTimeArray1[3][_this.data.dateTime1[3]] + ':' + _this.data.dateTimeArray1[4][_this.data.dateTime1[4]];

    _this.data.event.end_time = "" + _this.data.dateTimeArray[0][_this.data.dateTime[0]] + '-' + _this.data.dateTimeArray[1][_this.data.dateTime[1]] + '-' + _this.data.dateTimeArray[2][_this.data.dateTime[2]] + ' ' + _this.data.dateTimeArray[3][_this.data.dateTime[3]] + ':' + _this.data.dateTimeArray[4][_this.data.dateTime[4]];

    var invalid = 0
    if (_this.data.event.name.length > 20) {
      wx.showToast({
        title: '活动名称不应超过20个字',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.name.length == 0) {
      wx.showToast({
        title: '请填写活动名称',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.agent_name.length > 20) {
      wx.showToast({
        title: '发起人的名字不应超过20个字',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.agent_name.length == 0) {
      wx.showToast({
        title: '请填写发起人的名字',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.agent_phone.length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.agent_phone.length != 11) {
      wx.showToast({
        title: '请填写正确的手机号码',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.limit == "" || _this.data.event.limit == 0) {
      wx.showToast({
        title: '人数上限必须大于0',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if ((_this.data.event.cost == "" && app.globalData.userInfo.role == '1')) {
      wx.showToast({
        title: '请填写活动费用',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if ((_this.data.event.cost < 0 && app.globalData.userInfo.role == '1')) {
      wx.showToast({
        title: '请填写活动费用',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (!isFinite(_this.data.event.cost) && app.globalData.userInfo.role == '1') {
      wx.showToast({
        title: '请填写活动费用',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.kind == 20) {
      wx.showToast({
        title: '请选择活动类型',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.select_position_text == "" && _this.data.role == 2) {
      wx.showToast({
        title: '请选择地图定位',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    var tempstartdate = Date.parse(_this.data.event.start_time.replace(/-/g, '/'))
    var tempenddate = Date.parse(_this.data.event.end_time.replace(/-/g, '/'))

    if (tempstartdate > tempenddate) {
      wx.showToast({
        title: '活动结束时间必须晚于开始时间',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.event_pic == '../../../image/fengm@2x.png') {
      wx.showToast({
        title: '请上传活动封面',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.overimagecount) {
      wx.showToast({
        title: '上传的图片不能超过5M',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    console.log(_this.data.province[_this.data.select_province].province)
    if (_this.data.select_province == 0 && _this.data.showdetailaddress == 1) {
      wx.showToast({
        title: '请选择省/市/区',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.address4 == '') {
      wx.showToast({
        title: '请填写详细地址',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (_this.data.event.comment == '') {
      wx.showToast({
        title: '请填写活动简介',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (app.globalData.userInfo.role == "2" && _this.data.event.publicity==1 && _this.data.event.additional == 1 && app.globalData.userInfo.isVIP == 0) {
      if (1 * app.globalData.honey_info.total_honey < 1 * app.globalData.rule[8].value) {
        invalid = 8
        wx.showToast({
          title: '蜂蜜不足',
          icon: 'none'
        })
      }
    }
    if (invalid == 0) {
      var tmp = wx.getStorageSync("isfirstcreate")
      if (tmp == 1) {
        _this.setData({ showModal1: true, textareastr: "", placestr: '' })
        _this.setData({ is_disabled: true })
      }
      else {
        _this.on_submit1()
      }
    }
  },
  on_submit1: function () {
    if (this.data.isfirstbtn == 1) return;
    else if (this.data.isfirstbtn == 0) {
      this.data.isfirstbtn = 1
    }
    wx.setStorageSync("isfirstcreate", 0)
    var _this = this;
    wx.uploadFile({
      url: app.globalData.mainURL + 'api/createEvent',
      filePath: _this.data.event.event_pic,
      name: 'file',
      formData: {
        'user_id': app.globalData.userInfo.user_id,
        'role': app.globalData.userInfo.role,
        'event_name': _this.data.event.name,
        'event_type': _this.data.event.kind,
        'agent_name': _this.data.event.agent_name,
        'agent_phone': _this.data.event.agent_phone,
        'start_time': _this.data.event.start_time,
        'end_time': _this.data.event.end_time,
        'province': _this.data.province_id,
        'city': _this.data.city_id,
        'area': _this.data.area_id,
        'detail_address': _this.data.event.address4,
        'longitude': _this.data.longitude,
        'latitude': _this.data.latitude,
        'limit': _this.data.event.limit,
        'cost': _this.data.event.cost,
        'comment': _this.data.event.comment,
        'publicity': _this.data.event.publicity,
        'additional': _this.data.event.additional,
        'member_state': app.globalData.userInfo.isVIP * 1,
      },
      success: function (res) {
        if (app.globalData.userInfo.role == 2 && _this.data.event.publicity == 1 && _this.data.event.additional == 1) {
          var honey = wx.getStorageSync('honey_info')
          honey.total_honey -= _this.data.honey * 1
          app.globalData.honey_info = honey
          wx.setStorageSync('honey_info', honey)
        }
        wx.showToast({
          title: '活动已创建成功',
          icon: 'success',
          time: 3000,
          success:function(){
            setTimeout(function () {
              wx.switchTab({
                url: '../../activity/activity',
                success: function () {
                  wx.showTabBar({
                  })
                }
              })
            },1000);            
          }
        })
      }
    })
  },
  bindprovincechange: function (e) {
    var _this = this
    for (var iter = 0; iter < _this.data.province.length; iter++) {
      if (_this.data.province[iter].id == e.detail.value) {
        _this.data.province_id = _this.data.province[iter].id
      }
    }
    this.setData({
      select_province: e.detail.value
    })
    if (_this.data.select_province == 0) return;
    wx.request({
      url: app.globalData.mainURL + "api/getCities",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        province: _this.data.province[_this.data.select_province].province
      },
      success: function (res) {
        _this.data.city_id = res.data.result[0].id;
        _this.setData({
          city: res.data.result,
          select_city: 0
        })
        wx.request({
          url: app.globalData.mainURL + "api/getAreas",
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            province: _this.data.province[_this.data.select_province].province,
            city: _this.data.city[_this.data.select_city].city
          },
          success: function (res) {
            _this.data.area_id = res.data.result[0].id;
            _this.setData({
              area: res.data.result,
              select_area: 0
            })
          }
        })
      }
    })
  },
  bindcitychange: function (e) {
    var _this = this
    for (var iter = 0; iter < _this.data.city.length; iter++) {
      if (_this.data.city[iter].id == e.detail.value) {
        _this.data.city_id = _this.data.city[iter].id
      }
    }
    this.setData({
      select_city: e.detail.value
    })
    wx.request({
      url: app.globalData.mainURL + "api/getAreas",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        province: _this.data.province[_this.data.select_province].province,
        city: _this.data.city[_this.data.select_city].city
      },
      success: function (res) {
        _this.data.area_id = res.data.result[0].id;
        _this.setData({
          area: res.data.result,
          select_area: 0
        })
      }
    })
  },
  bindareachange: function (e) {
    var _this = this
    for (var iter = 0; iter < _this.data.area.length; iter++) {
      if (_this.data.area[iter].id == e.detail.value) {
        _this.data.area_id = _this.data.area[iter].id
      }
    }
    this.setData({
      select_area: e.detail.value
    })
  },
  on_click_newaddress: function () {
    this.setData({
      select_province: this.data.province_id,
      select_city: this.data.city_id,
      select_area: this.data.area_id
    })
    this.setData({ showdetailaddress: 1 })
    var _this = this
    wx.request({
      url: app.globalData.mainURL + "api/getCities",
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        province: _this.data.province[_this.data.province_id].province
      },
      success: function (res) {
        var cities = res.data.result
        for (var index = 0; index < cities.length; index++) {
          if (cities[index].id == _this.data.city_id) {
            _this.setData({ select_city: index })
          }
        }
        _this.setData({
          city: res.data.result
        })
        console.log(_this.data.city_id)
        if (res.data.status) {
          wx.request({
            url: app.globalData.mainURL + "api/getAreas",
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              province: _this.data.province_name,
              city: _this.data.city_name
            },
            success: function (res) {
              var areas = res.data.result
              for (var index = 0; index < areas.length; index++) {
                if (areas[index].id == _this.data.area_id) {
                  _this.setData({ select_area: index })
                }
              }
              _this.setData({
                area: res.data.result
              })
            }
          })
        }
      }
    })
  },
  onCancel1: function () {
    this.setData({
      showModal1: false,
      textareastr: this.data.event.comment,
      placestr: "请输入活动简介，不超过500字",
      is_disabled: false
    });
    this.setData({ placestr: '请输入活动简介，不超过500字' })
  },
  onConfirm1: function () {
    this.on_submit1()
    this.setData({
      showModal1: false
    });
  },
  preventTouchMove: function () {
    console.log("Ok")
  },
})