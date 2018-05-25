// pages/profile/my_focus/my_focus.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    favourite:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/getFavouriteSite',
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      data:{
        'user_id': app.globalData.userInfo.user_id
      },
      success: function(res){
        var fav_buf = res.data.result;
        if(fav_buf!=null){
          that.setData({
            favourite: fav_buf
          })
        }
      }
    })
  },
  phone_call: function (res) {
    var that = this
    wx.makePhoneCall({
      phoneNumber: that.data.favourite[res.currentTarget.id].phone,
      complete: function () {
        return
      }
    })
  },
  onShareAppMessage: function () {
  
  },
  btn_Clicked_Focus: function(event)
  {
    var that = this;
    wx.navigateTo({
      url: '../../index/detail_gym/detail_gym?id=' + that.data.favourite[event.currentTarget.id].boss_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    var a=new Array();
  },
  on_cancel: function(event)
  {
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/cancelFavouriteSite',
      header:{
        'content-type': 'application/json'
      },
      method: 'POST',
      data:{
        'boss_id': that.data.favourite[event.currentTarget.id].boss_id,
        'user_id': app.globalData.userInfo.user_id
      },
      success:function(res){
        wx.redirectTo({
          url: './my_focus'
        })
      }
    })
  }
})