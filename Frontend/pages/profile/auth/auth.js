// pages/profile/auth/auth.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    user_role: "场馆主",
    user: {
      name: "",
      phone: "",
      site_name: "",
      detail_address: "",
      id_no: "",
      allow_pic: "../../../image/002@2x.png",
      id_pic1: "../../../image/sfz@2x.png",
      id_pic2: "../../../image/sfb@2x.png",

    },
    hide: 0,
    role: 1,
    overimagecount: 0,
    longitude: 0,
    latitude: 0,
    sms_state: 0,
    sms_button_text: ['获取验证码', 's后重发'],
    sms_count_state: 1,
    second_count: 60,
    check_code: 0,
    sms_check_state: false,
    province: [],
    city: [],
    select_address: false,
    area: [],
    userRole: [],
    select_province: "",
    select_city: "",
    select_area: "",
    select_location_text: "",
    method: 'new',
    check_image: 0,
    check_auth_image1: 0,
    check_auth_image2: 0,
    disable: 1,
    istrue: 1
  },

  On_clicked_role: function () {
    if (this.data.method == 'new' || this.data.method == 'rewrite') {
      this.data.hide = !this.data.hide;
      this.setData({ hide: this.data.hide })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userRole: app.globalData.userRole
    })
    var method = options.method;
    this.setData({
      nickname: app.globalData.userInfo.nickname,
    })
    if (!app.globalData.userInfo.nickname) {
      wx.showModal({
        title: '获取用户信息失败',
        content: '由于无法获取您的信息，所以您无法进行身份认证',
        showCancel: false,
        complete: function (res) {
          wx.switchTab({
            url: '../../profile/profile',
            success: function () {
              wx.showTabBar({
              })
            }
          })
        }
      })
      return;
    }
    var _this = this
    if (method == null) {
      method = 'new'
    }
    var that = this
    if (method != 'new') {
      if (method == "rewrite") {
        this.setData({ disable: 0 })
        this.data.check_image = 1
        this.data.check_auth_image1 = 1
        this.data.check_auth_image2 = 1
      }
      wx.request({
        url: app.globalData.mainURL + 'api/getUserDetail',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          user_id: app.globalData.userInfo.user_id
        },
        success: function (res) {
          console.log(res)
          if (res.data.status == true) {
            var user_info = res.data.result[0]
            if (user_info.role == '2') {
              _this.setData({ istrue: 0 })
            }
            console.log("ok")
            console.log(user_info)
            if (user_info.role == 1) {
              user_info.allow_pic = app.globalData.uploadURL + user_info.allow_pic
              user_info.id_pic1 = app.globalData.uploadURL + user_info.id_pic1
              user_info.id_pic2 = app.globalData.uploadURL + user_info.id_pic2
            }
            if (user_info.allow_pic == undefined) {
              user_info.allow_pic = "../../../image/002@2x.png"
              user_info.id_pic1 = "../../../image/sfz@2x.png"
              user_info.id_pic2 = "../../../image/sfb@2x.png"
            }
            if (method == 'rewrite' && user_info.province_id != undefined) {
              _this.setData({
                select_province: user_info.province_id
              })
              wx.request({
                url: app.globalData.mainURL + "api/getCities",
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  province: user_info.province
                },
                success: function (res) {
                  for (var iter = 0; iter < res; iter++) {
                    if (res.data.result[iter].id == user_info.city_id)
                      break;
                  }
                  _this.setData({
                    city: res.data.result,
                    select_city: iter
                  })
                  wx.request({
                    url: app.globalData.mainURL + "api/getAreas",
                    method: 'POST',
                    header: {
                      'content-type': 'application/json'
                    },
                    data: {
                      province: user_info.province,
                      city: user_info.city
                    },
                    success: function (res) {
                      for (var iter = 0; iter < res; iter++) {
                        if (res.data.result[iter].id == user_info.area_id)
                          break;
                      }
                      _this.setData({
                        area: res.data.result,
                        select_area: iter
                      })
                    }
                  })
                }
              })
            }
            that.setData({
              user: user_info,
              role: user_info.role,
              user_role: that.data.userRole[user_info.role],
              method: method
            })
          }
        }
      })
    }
    wx.request({
      url: app.globalData.mainURL + 'api/getProvinces',
      success: function (res) {
        console.log(res)
        var tempprovince = res.data.result
        tempprovince.unshift({ id: "0", province: "请选择省" })
        _this.setData({
          province: tempprovince,
          select_province: 0
        })
        _this.setData({
          city: [{ id: "0", city: "请选择市" }],
          select_city: 0
        })
        _this.setData({
          area: [{ id: "0", area: "请选择区" }],
          select_area: 0
        })
      }
    })
    
  },

  on_click_radio: function (e) {
    if (this.data.method == "new" || this.data.method == 'rewrite') {
      if (e.currentTarget.id == "radio2") {
        this.data.user_role = "个人"
        this.data.role = 2;
        this.data.istrue = 0;
      }
      else {
        this.data.role = 1;
        this.data.istrue = 1;
        this.data.user_role = "场馆主"
      }
      this.setData({istrue: this.data.istrue})
      this.setData({ role: this.data.role })
      this.setData({ user_role: this.data.user_role })
    }

  },
  On_blur_stadiuminfo: function (e) {
    this.data.user.site_name = e.detail.value;
  },
  On_blur_name: function (e) {
    this.data.user.name = e.detail.value;
  },
  On_blur_phone: function (e) {
    this.data.user.phone = e.detail.value;
  },
  On_blur_authnumber: function (e) {
    this.data.user.authnumber = e.detail.value;
  },
  On_blur_detailaddress: function (e) {
    this.data.user.detail_address = e.detail.value;
  },

  //receive sms
  On_click_authnumber: function (e) {
    var that = this
    if (that.data.sms_state == 0) {
      if(that.data.user.phone.length == 0){
        wx.showToast({
          title: '请填写手机号码',
          icon:'none',
          time: 3000
        })
        return
      }
      if (that.data.user.phone.length == 11) {
        var random = Math.ceil(Math.random() * 900000) + 99999;
        wx.request({
          url: app.globalData.smsURL,
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            'phonenumber': that.data.user.phone,
            'random': random
          },
          success: function (res) {
            if (res.result != "fail") {
              var interval = setInterval(function () {
                that.setData({
                  second_count: (that.data.second_count - 1)
                })
                if (that.data.second_count == 0) {
                  that.setData({
                    second_count: 60,
                    sms_state: 0
                  })
                  clearInterval(interval);
                }
              }, 1000)
              that.setData({
                sms_state: 1,
                check_code: random
              })
            }
          }
        })
      }
      else {
        wx.showToast({
          title: '请填写正确的手机号码',
          icon: 'none',
          duration: 3000
        })
      }
    }
  },
  On_click_map: function (e) {
    if (this.data.method == 'edit') return
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.data.longitude = res.longitude
        that.data.latitude = res.latitude
        that.setData({
          select_location_text: "已选择"
        })
      }
    })
  },
  On_click_registerimage: function (e) {
    if (this.data.method == "new" || this.data.method == "rewrite") {
      var that = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          if (res.tempFiles[0].size > 5120000) {
            that.data.overimagecount++;
          }
          that.data.check_image = 1
          that.data.user.allow_pic = res.tempFilePaths[0];
          that.setData({ user: that.data.user })
          console.log('########   UserId ################',app.globalData.userInfo.user_id);
          wx.uploadFile({
            url: app.globalData.mainURL + 'api/addAllowPic',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'user_id': app.globalData.userInfo.user_id,
            },
            success: function (res) {              
              console.log(res);
            }
          })
        },
      })
    }
  },
  On_blur_idcard: function (e) {
    this.data.user.id_no = e.detail.value;
  },
  On_click_frontimage: function (e) {
    if (this.data.method == "new" || this.data.method == "rewrite") {
      var that = this;
      wx.chooseImage({
        count: 1,
        success: function (res) {
          if (res.tempFiles[0].size > 5120000) {
            that.data.overimagecount++;
          }
          that.data.check_auth_image1 = 1
          that.data.user.id_pic1 = res.tempFilePaths[0];
          that.setData({ user: that.data.user })
          wx.uploadFile({
            url: app.globalData.mainURL + 'api/addIDPic1',
            filePath: res.tempFilePaths[0],
            name: 'file',
            formData: {
              'user_id': app.globalData.userInfo.user_id,
            },
            success: function () {
            }
          })
        },
      })
    }
  },
  On_click_backimage: function (e) {
    if (this.data.method == "new" || this.data.method == "rewrite") {
      var that = this;
      wx.chooseImage({
        count:1,
        success: function (res) {
          if (res.tempFiles[0].size > 5120000) {
            that.data.overimagecount++;
          }
          that.data.check_auth_image2 = 1
          that.data.user.id_pic2 = res.tempFilePaths[0];
          that.setData({ user: that.data.user })
          wx.uploadFile({
            url: app.globalData.mainURL + 'api/addIDPic2',
            filePath: that.data.user.id_pic2,
            name: 'file',
            formData: {
              'user_id': app.globalData.userInfo.user_id,
            },
            success: function (res) {
            }
          })
        },
      })
    }
  },
  On_click_submit: function (e) {
    var that = this;
    if (that.data.method == "new" || that.data.method == 'rewrite') {
      var invalid = 0;
      if (that.data.role == 1) {
        if (that.data.overimagecount > 0) {
          invalid = invalid + 1
          wx.showToast({
            title: '上传的照片请不要超过5M',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if(that.data.user.site_name.length == 0)
        {
          wx.showToast({
            title: '请填写场馆名称',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.user.site_name.length > 20) {
          invalid = invalid + 1
          wx.showToast({
            title: '场馆名称不应超过20个字',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.user.name.length == 0) {
          invalid = invalid + 1
          wx.showToast({
            title: '请填写馆主姓名',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.user.name.length > 4) {
          invalid = invalid + 1
          wx.showToast({
            title: '馆主姓名不应超过4个字',
            duration: 3000,
            icon: 'none'
          })
          return
        }

        if (that.data.user.detail_address.length == 0) {
          invalid = invalid + 1
          wx.showToast({
            title: '请填写详细地址',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.user.detail_address.length > 20) {
          invalid = invalid + 1
          wx.showToast({
            title: '详细地址不要超过20个字',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.user.id_no.length == 0) {
          invalid = invalid + 1
          wx.showToast({
            title: '请填写身份证号',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.user.id_no.length > 18 || that.data.user.id_no.length <15) {
          invalid = invalid + 1
          wx.showToast({
            title: '请填写正确的身份证号',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.check_image != 1) {
          invalid = invalid + 1
          wx.showToast({
            title: '请上传营业执照照片',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.check_auth_image1 != 1) {
          invalid = invalid + 1
          wx.showToast({
            title: '请上传两张身份证照片（正反面各一张）',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.check_auth_image2 != 1) {
          invalid = invalid + 1
          wx.showToast({
            title: '请上传两张身份证照片（正反面各一张）',
            duration: 3000,
            icon: 'none'
          })
          return
        }
        if (that.data.province[that.data.select_province].value == '请选择省') {
          invalid = invalid + 1
          wx.showToast({
            title: '请选择省/市/区',
            duration: 3000,
            icon: 'none'
          })
          return
        }
      }
      else {
        if (that.data.user.name.length == 0) {
          invalid = invalid + 1
          wx.showToast({
            title: '请填写真实姓名',
            duration: 3000,
            icon: 'none'
          })
          return
        }
      if (that.data.user.name.length > 4) {
        invalid = invalid + 1
        wx.showToast({
          title: '真实姓名不应超过4个字',
          duration: 3000,
          icon: 'none'
        })
        return
      }
      }
    if (that.data.check_code * 1 != 1 * that.data.user.authnumber) {
      invalid = invalid + 1
      wx.showToast({
        title: '验证码错误!',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    if (invalid == 0) {
      if (that.data.role == 2) {
        app.globalData.role = 2
        app.globalData.state = 1
        wx.request({
          url: app.globalData.mainURL + 'api/registerUser',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            user_id: app.globalData.userInfo.user_id,
            role: 2,
            name: that.data.user.name,
            phone: that.data.user.phone
          },
          success: function (res) {
            if (res.data.status == true) {
              app.globalData.userInfo.state = 1
              app.globalData.userInfo.name = that.data.user.name
              app.globalData.userInfo.phone = that.data.user.phone
              app.globalData.userInfo.role = 2

              wx.redirectTo({
                url: './auth-text/auth_text',
              })
            }
          }
        })

      }
      else {

        wx.showLoading({
          title: '加载中',
          mask: true,
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
        app.globalData.role = 1
        app.globalData.state = 1
        wx.request({
          url: app.globalData.mainURL + 'api/registerBoss',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            role: 1,
            user_id: app.globalData.userInfo.user_id,
            name: that.data.user.name,
            phone: that.data.user.phone,
            site_name: that.data.user.site_name,
            province: that.data.province[that.data.select_province].id,
            city: that.data.city[that.data.select_city].id,
            area: that.data.area[that.data.select_area].id,
            detail_address: that.data.user.detail_address,
            longitude: that.data.longitude,
            latitude: that.data.latitude,
            id_no: that.data.user.id_no
          },
          success: function (res) {
          }

        })
        console.log(that.data.user.allow_pic)
        app.globalData.userInfo.state = 1
        app.globalData.userInfo.name = that.data.user.name
        app.globalData.userInfo.phone = that.data.user.phone
        app.globalData.userInfo.role = 1
        wx.redirectTo({
          url: './auth-text/auth_text',
        })
      }
    }
  }
    else {
    if(that.data.check_code * 1 != 1 * that.data.user.authnumber) {
      wx.showToast({
        title: '验证码错误！',
        duration: 3000,
        icon: 'none'
      })
      return;
    }
      if (1) {
  app.globalData.state = 1
  wx.request({
    url: app.globalData.mainURL + 'api/updateUserPhone',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: {
      user_id: app.globalData.userInfo.user_id,
      phone: that.data.user.phone
    },
    success: function (res) {
      wx.redirectTo({
        url: './auth-text/auth_text',
      })
    }
  })
}
    }
  },

//personal data input
On_blur_name1: function (e) {
  this.data.user.name = e.detail.value;
},
On_blur_phone1: function (e) {
  this.data.user.phone = e.detail.value;
},
On_blur_authnumber: function (e) {
  this.data.user.authnumber = e.detail.value;
},
bindprovincechange: function (e) {
  var _this = this
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
      console.log(res)
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
      _this.setData({
        area: res.data.result,
        select_area: 0
      })
    }
  })
},
bindareachange: function (e) {
  this.setData({
    select_area: e.detail.value
  })
}
})