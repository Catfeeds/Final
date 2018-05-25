const app = getApp()
var amapFile = require('../../lib/amap-wx.js')
var myAmap = new amapFile.AMapWX({ key: "F8f1f5c8a20c199dd0f70f5a6b162280" })
var mapCtx
Page({
  data: {
    text: 'Hello world',
  },
  onLoad: function (option) {
     this.setData({
      text: this.data.text
    })
  }
})
