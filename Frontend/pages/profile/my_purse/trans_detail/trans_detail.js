//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    title: [
      '申请提现',
      '申请提现',
      '申请提现',
      '用户报名蜂约',
      '用户取消蜂约',
      '取消活动',
      '取消活动',
      '报名蜂约',
      '取消蜂约',
    ],
    sub_title: [
      '提现中',
      '提现成功',
      '提现失败'
    ],
    plus: ['-','-','+','+','-','-','+','-','+'],
    payment:[],
  },
  onLoad:function()
  {
    var that = this;
    wx.request({
      url: app.globalData.mainURL + 'api/getPaymentHistory',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        'user_id': app.globalData.userInfo.user_id
      },
      success: function (res) {
        console.log("asdf")
        if(res.data.status==true){
          var payment = res.data.payment
          for(var index=0; index<payment.length; index++){
            if(Math.floor(payment[index].amount) == payment[index].amount){
              payment[index].amount +='.00'
            }
          }
          that.setData({
            payment: payment,
          })
        }
      }
    })
  }
})
