//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    img_black_start_src: '../../../image/star_n@2x.png',
    img_yellow_start_src: '../../../image/star_s@2x.png',
    star_img_position: 122,
    count_yellowStar: 3,
    text_count: 0,
    comment: '',
    booking_id: 0
  },
  onLoad: function (param) {

    this.setData({
      booking_id: param.id
    })
  },
  bindInputText: function (e) {
    this.setData({
      text_count: e.detail.cursor,
      comment: e.detail.value  
    })
  },

  additionStar: function (event) {
    this.setData({ count_yellowStar: this.data.count_yellowStar + 1 })
  },

  subtractStar: function (event) {
    this.setData({ count_yellowStar: this.data.count_yellowStar - 1 })
  },
  btn_submit: function(){
    if(this.data.comment.length<=200){
      var that= this;
      wx.request({
        url: app.globalData.mainURL + 'api/addRating',
        method: 'POST',
        header:{
          'content-type': 'application/json'
        },
        data:{
          'booking_id': that.data.booking_id,
          'point': that.data.count_yellowStar,
          'comment': that.data.comment
        },
        success: function(res)
        {
          if(res.data.status == true)
          {
            wx.redirectTo({
              url: '../../profile/my_booking/booking',
            });
          }
        }
      })
    }
    else{
      wx.showToast({
        title: '你输入的字符超过200字！',
        icon:'none'
      })
    }
    console.log(this.data.comment)
  }
})
