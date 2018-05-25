//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    image_cancel_success_src: '../../../image/success@2x.png',
    kind: 0,
    cancel_sucess_text: ["提交成功，钱款将在1-3个工作日到账", "取消成功，钱款将在1-3个工作日退回", "报名成功"]
  },
  onLoad: function (option) {
    this.setData({
      kind: option.type
    })
  },
  on_return: function () {
    if(this.data.kind==2){
      wx.switchTab({
        url: '../../activity/activity'
      })
    }
    else{
      wx.switchTab({
        url: '../profile',
      })
    }
  }
})
