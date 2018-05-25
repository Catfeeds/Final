// pages/backyard/mainbeeshop/mainbeeshop.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({ total_honey: app.globalData.honey_info.total_honey })
    this.setData({ upload_url: app.globalData.uploadURL})
    wx.request({
      url: app.globalData.mainURL + 'api/getGoodsList',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!res.data.status) return;
        console.log(res.data.result);
        that.setData({product_array: res.data.result})
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
  On_click_product: function(query)
  {
    wx.navigateTo({
      url: '../product_detail/product_detail?id=' + query.currentTarget.id,
    })
  }
})