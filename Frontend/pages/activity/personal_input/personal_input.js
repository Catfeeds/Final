const app = getApp()

Page({
  data: {
    eventData: { "ground_image": "", "act_type": "", "act_status": "", "favourite": 0, "act_name": "", "member_count": 0, "cost": 0, "act_date": " ", "address": "", "ground_name": "", "ground_owner": "", "max_member": 0, "act_intro": "" },
    param: {
      user_avatar: "../../../image/temp.jpg",
      nickname: "ttt",
    },
    realname:"",
    phonenumber:0,
    memcount:0,
    totalcost:0,
  },
  onLoad: function(res)
  {
    this.setData({ eventData: app.globalData.eventData})
    this.data.user_avatar = app.globalData.userInfo.avatar
    this.data.nickname = app.globalData.userInfo.nickname
    this.setData({ user_avatar: this.data.user_avatar})
    this.setData({ nickname: this.data.nickname })
    this.setData({eventData: this.data.eventData})
  },
  on_Input_Realname: function(event)
  {
    this.setData({realname: event.detail.value});
  },
  on_Input_Phonenumber: function(event)
  {
    this.setData({ phonenumber: event.detail.value });
  },
  on_Input_Memcount: function (event) {
    this.setData({ memcount: event.detail.value });
    this.setData({ total_cost: event.detail.value * this.data.eventData.cost})
  },
  on_Btn_OK: function()
  {
    var x = 0
    if (this.data.realname.length > 4 || this.data.realname.length == 0 )
    {
      x++
      this.setData({val_realname: "error"})
    }
    if (this.data.phonenumber.toString().length > 11 || this.data.phonenumber.toString().length == 1)
    {
      x++
      this.setData({ val_phonenumber: "error" })
    }
    if (this.data.memcount > (this.data.eventData.max_member - this.data.eventData.member_count) || this.data.memcount == 0) 
    {
      x++
      this.setData({ val_memcount: "error" })
    }
    if(x == 0)
    {
    }
  }
})
