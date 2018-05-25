const app = getApp()
var amapFile = require('../../../lib/amap-wx.js')
var myAmap = new amapFile.AMapWX({ key: "f8f1f5c8a20c199dd0f70f5a6b162280" })
var mapCtx
Page({
  data: {
    favorinput: [],
    isshow: 1,
    curlat: 0,
    curlong: 0,
    site: []
  },
  onLoad: function () {
    //wx.setStorageSync("favorinputtext", [])
    this.data.favorinput = wx.getStorageSync("favorinputtext")
    this.data.favorinput.reverse = this.data.favorinput.reverse()
    this.setData({ favorinput: this.data.favorinput })
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.data.curlat = res.latitude
        that.data.curlong = res.longitude
      }
    })
    wx.request({
      url: app.globalData.mainURL + 'api/getAllBoss',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!res.data.status) return;
        that.data.site = res.data.result
        for (var index = 0; index < that.data.site.length; index++) {
          if (that.data.site[index].site_name == null) {
            that.data.site.splice(index, 1);
            index--;
          }
        }
        console.log(that.data.site)
      },
    })
  },
  //get tips by input
  on_input_text: function (res) {
    var that = this
    this.setData({ isshow: 0 })
    var keywords = res.detail.value;
    console.log(keywords)
    if (keywords == '') {
      that.setData({ tips: '' })
      return;
    }
    myAmap.getInputtips({
      keywords: keywords,
      location: that.data.curlong + ',' + that.data.curlat,
      success: function (data) {
        if (data && data.tips) {
          var datatemp = data
          console.log("OK")
          for (var iter = 0; iter < that.data.site.length; iter++) {
            if (that.data.site[iter].site_name.includes(keywords)) {
              datatemp.tips.unshift({ id: "own", name: that.data.site[iter].site_name, location: that.data.site[iter].logitude + ',' + that.data.site[iter].latitude })
            }
          }
          that.setData({
            tips: datatemp.tips
          });
        }
      }
    })
  },
  //click place
  on_bindSearch: function (res) {
    var that = this
    var keyword = res.target.dataset.keywords
    if (res.currentTarget.id == "own") {
      for (var iter = 0; iter < that.data.site.length; iter++) {
        if (that.data.site[iter].site_name == keyword) {
          that.data.favorinput.push({ name: keyword, longitude: that.data.site[iter].longitude, latitude: that.data.site[iter].latitude })
          wx.setStorageSync("favorinputtext", that.data.favorinput)
          app.globalData.searchlat = that.data.site[iter].latitude
          app.globalData.searchlong = that.data.site[iter].longitude
          app.globalData.issearch = 1
          wx.switchTab({
            url: '../index',
          })
        }
      }
    }
    else {
      myAmap.getInputtips({
        keywords: keyword,
        location: '',
        success: function (data) {
          var i = 0
          while (data.tips[i].location.length == 0) {
            i++
          }
          var long = data.tips[i].location.split(',')[0]
          var lat = data.tips[i].location.split(',')[1]
          that.data.favorinput.push({ name: keyword, longitude: long, latitude: lat })
          wx.setStorageSync("favorinputtext", that.data.favorinput)
          app.globalData.searchlat = lat
          app.globalData.searchlong = long
          app.globalData.issearch = 1
          wx.switchTab({
            url: '../index',
          })
        }
      })
    }
  },

  on_click_cancel: function () {
    this.setData({ isshow: 1 })
    this.setData({ tips: '' })
    this.setData({ inputtext: '' })
  },

  on_click_delete: function () {
    wx.setStorageSync("favorinputtext", [])
    this.setData({ favorinput: [] })
  },

  on_click_favor_item: function (res) {
    var that = this
    console.log(that.data.favorinput[res.currentTarget.id].latitude)
    console.log(that.data.favorinput[res.currentTarget.id])
    app.globalData.searchlat = that.data.favorinput[res.currentTarget.id].latitude
    app.globalData.searchlong = that.data.favorinput[res.currentTarget.id].longitude
    app.globalData.issearch = 1
    wx.switchTab({
      url: '../index',
    })
  }
})