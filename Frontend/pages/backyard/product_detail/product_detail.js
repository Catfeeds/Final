// pages/backyard/product_detail/product_detail.js
var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    disable: 1,
    btn_text:"立即兑换",
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.mainURL + 'api/getGoodDetail',
      data: {
        id: options.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.result[0])
        if (!res.data.status) return;
        that.data.id = res.data.result[0].id
        that.data.cost = res.data.result[0].cost
        var comment = res.data.result[0].comment
        WxParse.wxParse('comment', 'html', comment, that)
        that.setData({ btn_text: "立即兑换", disable: 0 })
        if ( 1 * res.data.result[0].cost > 1 * app.globalData.honey_info.total_honey)
        {
          that.setData({ btn_text: "蜂蜜不足", disable: 1})
        }
        if(res.data.result[0].amount==0){
          that.setData({ btn_text: "缺货", disable: 1 })
        }
        var url = app.globalData.uploadURL + res.data.result[0].pic ;
        res.data.result[0].pic = url
        /*
        if (res.data.result[0].amount == '0')
        {
          that.setData({ btn_text: "缺货", disable: 1})
        }
        */
        that.setData({product: res.data.result[0]})
      },
      fail: function () {
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  On_click_order:function()
  {
    var that = this
    wx.redirectTo({
      url: '../product_order/product_order?id=' + that.data.id,
    })
  }
})