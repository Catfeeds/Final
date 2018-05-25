//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    eventData: { "ground_image": "../../../image/temp.jpg", "act_type": "足球比赛", "act_status": "进行中", "favourite": 200, "act_name": "足球", "member_count": 10, "cost": 20, "act_date": " 2018-02-22 13:00", "address": "北京大学体育馆23号足球场", "ground_name": "北京大学体育馆", "ground_owner": "郭德纲", "max_member": 15, "act_intro": "玩的很愉快玩的很愉快玩的很愉快玩的很愉快玩的" },
    is_disabled: false,
    favor_src: "../../../image/good_n@2x.png",
    favour_num: 0
  },
  onLoad: function (option) {
    var image_array = ["../../../image/temp.jpg", "../../../image/Home_s@3x.png", "../../../image/my_attention@3x.png", "../../../image/my_s@3x.png"]
    this.setData({ image_array: image_array })

    this.data.favour_num = this.data.eventData.favourite
    this.setData({ favour_num: this.data.favour_num})
    if (this.data.eventData.act_status == "已取消")
    {
      this.setData({ btn_text: "已取消"})
      this.setData({ is_disabled: true})
    }
    else if(this.data.eventData.max_member == this.data.eventData.mebmer_count)
    {
      this.setData({ btn_text: "人数已满" })
      this.setData({ is_disabled: true })
    }
    else {
      this.setData({ btn_text: "立即参加" })
      this.setData({ is_disabled: false })
    }
    if (this.data.eventData.act_status == '已完成') {
      that.setData({
        is_disabled: true,
        btn_text: '活动完成'
      })
    }
    //code for liseter paticipate
  },

  btn_Clicked_Personal_Input: function () {
    app.globalData.eventData = this.data.eventData
    wx.redirectTo({
      url: '../personal_input/personal_input',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btn_Clicked_Gym_Info: function () {
    wx.navigateTo({
      url: '../detail_gym/detail_gym',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  btn_Clicked_Favor:function(){
    if (this.data.favor_src == "../../../image/good_n@2x.png")
    {
      this.setData({ favor_src: "../../../image/good_s@2x.png" })
      this.data.favour_num ++
      this.setData({favour_num: this.data.favour_num})
    }
    else{
      this.setData({ favor_src: "../../../image/good_n@2x.png" })
      this.data.favour_num--
      this.setData({ favour_num: this.data.favour_num }) 
    }
  }
})
