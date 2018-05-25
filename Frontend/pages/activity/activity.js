//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    sport_kind_text: ["足球", "篮球", "排球", "羽毛球", "乒乓球", "台球", "网球", "保龄球", "健身馆", "瑜伽", "游泳", "射击射箭", "跆拳道", "滑冰", "滑雪", "休闲桌游", "运动装备", "其他"],
    active1: "active",
    active2: "",
    modal_active1: "active",
    modal_active2: "",
    showModal: 0,
    events: [],
    selected_state: 0,
    userInfo: [],
    eventType: [],
    userRole: [],
    eventState: [],
    favor: [],
    select_tab: 0,
    filter_role: 1,
    filter_type: 0,
    select_type: 0,
    select_role: 1,
    select_start: '',
    select_end: '',
    starttime: '开始时间',
    endtime: '结束时间',
    isfilterset: 0,
  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this; 
    that.data.active1 = "active"
    that.data.active2 = ""
    that.data.modal_active1 = "active"
    that.data.modal_active2 = ""
    that.data.showModal = 0
    that.data.select_tab = 0
    that.data.filter_role = 1
    that.data.filter_type = 0
    that.data.select_type = 0
    that.data.select_role = 1
    that.data.select_start = ''
    that.data.select_end = ''
    that.data.starttime = '开始时间'
    that.data.endtime = '结束时间'
    that.data.isfilterset = 0
    that.data.selected_state = 0
    this.setData({
    active1 : that.data.active1,
    active2: that.data.active2,
    modal_active1:that.data.modal_active1,
    modal_active2:that.data.modal_active2,
    showModal:that.data.showModal,
    select_tab:that.data.select_tab,
    filter_role:that.data.filter_role,
    filter_type:that.data.filter_type,
    select_type:that.data.select_type,
    select_role:that.data.select_role,
    select_start:that.data.select_start,
    select_end:that.data.select_end,
    starttime:that.data.starttime,
    endtime:that.data.endtime,
    isfilterset:that.data.isfilterset,
    selected_state:that.data.selected_state
    })
    wx.getLocation({
      success: function (res) {
        var longitude = res.longitude;
        var latitude = res.latitude;
        var url = 'https://restapi.amap.com/v3/geocode/regeo?key=8eb63e36d0b6d7d29a392503a4a80f6c&location=' + longitude + ',' + latitude + '&poitype=&radius=&extensions=all&batch=false&roadlevel=0';
        wx.request({
          url: url,
          success: function (res) {
            var city = res.data.regeocode.addressComponent.city
            var province = res.data.regeocode.addressComponent.province
            console.log(res)
            wx.request({
              url: app.globalData.mainURL + 'api/getEventsByProvince',
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              data: {
                city: city,
                province: province,
                user_id: app.globalData.userInfo.user_id
              },
              success: function (res) {
                console.log(res)
                var event_buf = res.data.result;
                if (event_buf != null) {
                  for (var index = 0; index < event_buf.length; index++) {
                    var time = event_buf[index].start_time.split(':');
                    event_buf[index].start_time = time[0] + ':' + time[1];
                    time = event_buf[index].end_time.split(':');
                    event_buf[index].end_time = time[0] + ':' + time[1];
                    var start_date = event_buf[index].start_time.split(' ')
                    event_buf[index].start_time_now = Date.parse(start_date[0].replace(/-/g, '/'))
                    event_buf[index].end_time_now = Date.parse(event_buf[index].end_time.replace(/-/g, '/'))
                    if (event_buf[index].current_member == null) {
                      event_buf[index].current_member = 0;
                    }
                    if (event_buf[index].name.length > 10) {
                      var name = event_buf[index].name
                      name = name.slice(0, 10) + '..'
                      event_buf[index].name = name
                    }
                  }
                  that.setData({
                    events: event_buf,
                    favor: res.data.favor,
                    userInfo: app.globalData.userInfo,
                    eventType: app.globalData.eventType,
                    userRole: app.globalData.userRole,
                    eventState: app.globalData.eventState
                  })
                }
              }
            })
          }
        })
      },
    })
  },
  On_click_favourite: function (e) {

  },
  On_click_modal_open: function (e) {
    this.data.showModal = 1
    wx.hideTabBar({
      
    })
    this.setData({ showModal: this.data.showModal })
  },
  selectTab: function (e) {
    if (e.currentTarget.id == 'tab-btn1' & this.data.active1 == "") {
      this.setData({ active1: "active", active2: "" })
      this.setData({ select_tab: 0, isfilterset: 0 })
    }
    if (e.currentTarget.id == 'tab-btn2' & this.data.active2 == "") {
      this.setData({ active1: "", active2: "active" })
      this.setData({ select_tab: 1, isfilterset: 0 })
    }
  },
  On_click_hide: function () {
    this.data.showModal = 0;
    wx.showTabBar({
      
    })
    this.setData({ showModal: 0 })
  },
  click_detail_event: function (event) {
    wx.navigateTo({
      url: '../index/detail_event/detail_event?id=' + event.currentTarget.id
    })
  },
  click_cancel: function(){
    this.setData({
      isfilterset : 0
    })
    this.hideModal()
  },
  hideModal: function () {
    this.data.showModal = 0;

    wx.showTabBar({
      animation: false
    })
    this.setData({ showModal: 0 })
  },
  on_click_role: function (event) {
    if (event.currentTarget.id == 2) {
      this.setData({
        modal_active1: "",
        modal_active2: "active",
        filter_role: 2
      })
    }
    else {
      this.setData({
        modal_active1: "active",
        modal_active2: "",
        filter_role: 1
      })
    }
  },
  on_click_type: function (event) {
    var event_type = event.currentTarget.id
    this.setData({
      filter_type: event_type
    })
  },
  change_filter: function () {
    var isstarttime = 0
    var isendtime = 0
    if (this.data.starttime == '开始时间') {
      isstarttime = Date.parse('2000-01-01')
    }
    else {
      isstarttime = Date.parse(this.data.starttime.replace(/-/g, '/'))
    }
    console.log(this.data.starttime)
    console.log(isstarttime)
    if (this.data.endtime == '结束时间') {
      isendtime = Date.parse('2100-01-01')
    }
    else {
      isendtime = Date.parse(this.data.endtime.replace(/-/g, '/')) + 86400000
    }
    console.log(this.data.endtime)
    console.log(isendtime)
    console.log(Date.parse("2018-05-13"))
    this.setData({
      select_type: this.data.filter_type.toString(),
      select_role: this.data.filter_role.toString(),
      select_start: isstarttime,
      select_end: isendtime,
      isfilterset: 1
    })
    this.hideModal()
  },
  starttime_picker: function (e) {
    this.setData({
      starttime: e.detail.value
    })
  },
  endtime_picker: function (e) {
    this.setData({
      endtime: e.detail.value
    })
  }
})
