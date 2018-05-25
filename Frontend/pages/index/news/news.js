// pages/index/news/news.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:[
      '评价消息',
      '提现到账消息',
      '提现失败消息',
      '报名活动消息',
      '取消蜂约消息',
      '收取蜂蜜消息',
      '认证成功',
      '认证失败',
      '取消蜂约退款',
      '活动提醒消息',
      '取消活动消息',
      '取消活动退款',
    ],
    content:[
      '给您进行了评价！',
      '您申请的提现已经到账，请查看',
      '很遗憾，您提现失败，请您重新提交！',
      '参加了您创建的',
      '用户取消了',
      '活动已结束，请及时收取蜂蜜！',
      '恭喜您认证成功！',
      '很遗憾您的认证未通过审核，请重新提交！',
      '蜂约，退款已经到账，请您查收！',
      '还有5个小时就要开始了！',
      '被发起人取消了，请知晓！',
      '被发起人取消，退款已经到账，请您查收！'
    ],
    eventData:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      eventData: app.globalData.eventType
    })
    wx.request({
      url: app.globalData.mainURL + 'api/getAlarm',
      data: {
        user_id: app.globalData.userInfo.user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var newsarray = res.data.news

        var newsviewarray = new Array()
        var now = Date.now()

        var tempobject = new Object()
        var tempdate

        for (var iter = 0; iter < newsarray.length; iter++) {
          tempobject = newsarray[iter]
          tempdate = Date.parse(newsarray[iter].submit_time.replace(/-/g, '/'))
          if (now - tempdate < 120000) {
            tempobject.submit_time = "刚刚"
          }
          else if (now - tempdate < 3600000) {
            var minute = (now-tempdate)/60000
            minute = Math.floor(minute)
            tempobject.submit_time = minute+"分钟前"
          } 
          else if (now - tempdate < 86400000) {
            var hour = (now - tempdate) / 3600000
            hour = Math.floor(hour)
            tempobject.submit_time = hour + "小时前"
          }
          else if (now - tempdate < 172800000) {
            tempobject.submit_time = "昨天"
          }
          else {
            var time = newsarray[iter].submit_time.split(' ')
            tempobject.submit_time = time[0]
          }
          if(tempobject.name==null){
            tempobject.name = tempobject.nickname
          }
          tempobject.type = 1* tempobject.type
          newsviewarray.push(tempobject)
        }
        that.setData({ newsarray: newsviewarray })
      },
    })
    app.globalData.see_news = 1;
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

  }
})