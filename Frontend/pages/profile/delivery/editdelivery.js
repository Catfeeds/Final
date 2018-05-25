// pages/profile/delivery/editdelivery.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    method: '',
    address: { 'no': 0, 'detail_address': '', 'province': "", 'city': "", 'area': "", 'name': '', 'email': '', 'phone': '' },
    province: [],
    city: [],
    area: [],
    select_province: 0,
    select_city: 0,
    select_area: 0,
    address_no: 0,
    kind: 0,
    product_id: 0,
    select_address: 0,
    detail_input: '',
    pid: 0,
    cid: 0,
    aid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    _this.data.address_no = options.no
    wx.request({
      url: app.globalData.mainURL + 'api/getProvinces',
      success: function (res) {
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
    if (options.no != 0) {
      var address_buf = this.data.address;
      address_buf.no = options.no;
      address_buf.name = options.name;
      address_buf.phone = options.phone;
      address_buf.province = options.province;
      address_buf.city = options.city;
      address_buf.area = options.area;
      address_buf.detail_address = options.detail_address;
      address_buf.email = options.email;
      this.data.pid = options.pid;
      this.data.cid = options.cid;
      this.data.aid = options.aid;
      for (var iter = 0; iter < this.data.province.length; iter++) {
        if (this.data.province[iter].value == address_buf.province) {
          this.data.select_province = this.data.province[iter].id;
        }
      }
      this.setData({
        address: address_buf
      })
      this.setData({
        method: 'change'
      })
    }
    else {
      this.setData({
        method: 'new'
      })
    }
    if (options.kind != null) {
      _this.data.kind = options.kind
      _this.data.product_id = options.id
      _this.data.method = 'new'
      _this.setData({
        method: 'new'
      })
    }

  },
  On_clicked_address: function (e) {
    this.data.select_address = !this.data.select_address;
    if (this.data.select_address) {
      var _this = this
      this.data.address.detail_address = ""
      wx.request({
        url: app.globalData.mainURL + 'api/getProvinces',
        success: function (res) {
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
    }
    this.setData({
      select_address: this.data.select_address
    })
  },
  bindChange: function (e) {
    var that = this
    var province = e.detail.value[0];
    if (province != that.data.select_province) {
      that.setData({
        select_province: province
      })
      wx.request({
        url: app.globalData.mainURL + "api/getCities",
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          province: that.data.province[province].province
        },
        success: function (res) {
          that.setData({
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
              province: that.data.province[province].province,
              city: that.data.city[that.data.select_city].city
            },
            success: function (res) {
              that.setData({
                area: res.data.result,
                select_area: 0
              })
            }
          })
        }
      })
    }
    else if (e.detail.value[1] != that.data.select_city) {
      that.setData({
        select_city: e.detail.value[1]
      })
      wx.request({
        url: app.globalData.mainURL + "api/getAreas",
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          province: that.data.province[province].province,
          city: that.data.city[that.data.select_city].city
        },
        success: function (res) {
          that.setData({
            area: res.data.result,
            select_area: 0
          })
        }
      })
    }
    else {
      that.setData({
        select_area: e.detail.value[2]
      })
    }
  },
  on_blur_postname: function (e) {
    this.data.address.name = e.detail.value
  },
  on_blur_phonenumber: function (e) {
    this.data.address.phone = e.detail.value
  },
  on_blur_address: function (e) {
    this.data.address.detail_address = e.detail.value
  },
  on_blur_mail: function (e) {
    this.data.address.email = e.detail.value;
  },
  on_click_submit: function (e) {
    var error = 0
    var that = this
    if(this.data.address.name.length ==0 ){
      wx.showToast({
        title: '请填写姓名',
        icon: 'none'
      })
      return
    }
    if (this.data.address.name.length < 2 || this.data.address.name.length > 6) {
      wx.showToast({
        title: '姓名应为2-6个字',
        icon: 'none'
      })
      return
    }
    
    console.log(this.data.select_province)
    if (this.data.select_province == 0 && that.data.method == "new") {
      wx.showToast({
        title: '请选择省/市/区',
        duration: 3000,
        icon: 'none'
      })
      return
    }
    
    if (this.data.address.phone.toString().length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none'
      })
      return
    }
    if (this.data.address.phone.toString().length != 11) {
      wx.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
      return
    }
    console.log(this.data.select_province)
    if (this.data.select_province == 0 && this.data.select_address == 1) {
      wx.showToast({
        title: '请选择省/市/区',
        icon: 'none'
      })
      return
    }
    if (this.data.address.email.length == 0)
    {
      wx.showToast({
        title: '请填写邮政编码',
        icon: 'none'
      })
      return;
    }
    if (this.data.address.detail_address.length == 0) {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none'
      })
      return;
    }
    if (error == 0) {
      if (that.data.method == "new") {
        wx.request({
          url: app.globalData.mainURL + 'api/addAcceptAddress',
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          data: {
            'user_id': app.globalData.userInfo.user_id,
            'name': that.data.address.name,
            'phone': that.data.address.phone,
            'province': that.data.province[that.data.select_province].id,
            'city': that.data.city[that.data.select_city].id,
            'area': that.data.area[that.data.select_area].id,
            'detail_address': that.data.address.detail_address,
            'email': that.data.address.email
          },
          success: function (res) {
            if (that.data.kind == 0)
              wx.switchTab({
                url: '../profile',
              })
            else {
              wx.redirectTo({
                url: '../../backyard/product_order/product_order?id=' + that.data.product_id,
              })
            }
          }
        })
      }
      else {
        if (that.data.select_address == 1) {
          console.log(that.data.province[that.data.select_province].id)
          wx.request({
            url: app.globalData.mainURL + 'api/changeAcceptAddress',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'address_id': this.data.address_no,
              'user_id': app.globalData.userInfo.user_id,
              'name': that.data.address.name,
              'phone': that.data.address.phone,
              'province': that.data.province[that.data.select_province].id,
              'city': that.data.city[that.data.select_city].id,
              'area': that.data.area[that.data.select_area].id,
              'detail_address': that.data.address.detail_address,
              'email': that.data.address.email
            },
            success: function (res) {
              console.log(res)
              if (that.data.kind == 0)
                wx.switchTab({
                  url: '../profile',
                })
              else {
                wx.redirectTo({
                  url: '../../backyard/product_order/product_order?id=' + that.data.product_id,
                })
              }
            }
          })
        }
        else{
          wx.request({
            url: app.globalData.mainURL + 'api/changeAcceptAddress',
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              'address_id': this.data.address_no,
              'user_id': app.globalData.userInfo.user_id,
              'name': that.data.address.name,
              'phone': that.data.address.phone,
              'province': that.data.pid,
              'city': that.data.cid,
              'area': that.data.aid,
              'detail_address': that.data.address.detail_address,
              'email': that.data.address.email
            },
            success: function (res) {
              console.log(res)
              if (that.data.kind == 0)
                wx.switchTab({
                  url: '../profile',
                })
              else {
                wx.redirectTo({
                  url: '../../backyard/product_order/product_order?id=' + that.data.product_id,
                })
              }
            }
          })
        }
      }
    }
  },
  bindprovincechange: function (e) {
    var _this = this
    this.setData({
      select_province: e.detail.value
    })
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
  },

})