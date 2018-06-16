import download from "download.js"
const app = getApp()
var amapFile = require('../../lib/amap-wx.js')
var myAmap = new amapFile.AMapWX({ key: "F8f1f5c8a20c199dd0f70f5a6b162280" })
var mapCtx
Page({
  data: {

    current_latitude: 0,
    current_longitude: 0,
    select_kind: 0,
    item_array: [{ id: 0, src: "../../image/move00@2x.png" }, { id: 1, src: "../../image/move01@2x.png" }, { id: 2, src: "../../image/move02@2x.png" }, { id: 3, src: "../../image/move03@2x.png" }, { id: 4, src: "../../image/move04@2x.png" }, { id: 5, src: "../../image/move05@2x.png" }, { id: 6, src: "../../image/move06@2x.png" }, { id: 7, src: "../../image/move07@2x.png" }, { id: 8, src: "../../image/move08@2x.png" }, { id: 9, src: "../../image/move09@2x.png" }, { id: 10, src: "../../image/move10@2x.png" }, { id: 11, src: "../../image/move11@2x.png" }, { id: 12, src: "../../image/move12@2x.png" }, { id: 13, src: "../../image/move13@2x.png" }, { id: 14, src: "../../image/move14@2x.png" }, { id: 15, src: "../../image/move15@2x.png" }, { id: 16, src: "../../image/move16@2x.png" }, { id: 17, src: "../../image/move17@2x.png" }, { id: 18, src: "../../image/move18@2x.png" }],
    show_array: [{ id: 0, src: "../../image/move00@2x.png" }, { id: 1, src: "../../image/move01@2x.png" }, { id: 2, src: "../../image/move02@2x.png" }, { id: 3, src: "../../image/move03@2x.png" }, { id: 4, src: "../../image/move04@2x.png" }, { id: 5, src: "../../image/move05@2x.png" }, { id: 6, src: "../../image/move06@2x.png" }, { id: 7, src: "../../image/move07@2x.png" }, { id: 8, src: "../../image/move08@2x.png" }, { id: 9, src: "../../image/move09@2x.png" }],
    uppoint: 0,
    downpoint: 9,
    currentkind: "../../image/move00@2x.png",
    marker: [],
    file_path:[],
    newscount: 0,
    events: [],
    currentid: 0,
    num: 0
  },
  onLoad: function (option) {
    mapCtx = wx.createMapContext('mymap')
  },
  onShow: function (option) {
    this.data.num = 0
    wx.showTabBar({
    })
    if (app.globalData.userInfo.forbidden == 1) {
      wx.showModal({
        title: '您的账号已被禁用',
        showCancel: false,
        complete: function () {
          wx.navigateBackMiniProgram({
          })

        }
      })
    }
    wx.setNavigationBarTitle({
      title: '蜂巢'
    })
    var that = this
    that.data.show_array = [{ id: 0, src: "../../image/move00@2x.png" }, { id: 1, src: "../../image/move01@2x.png" }, { id: 2, src: "../../image/move02@2x.png" }, { id: 3, src: "../../image/move03@2x.png" }, { id: 4, src: "../../image/move04@2x.png" }, { id: 5, src: "../../image/move05@2x.png" }, { id: 6, src: "../../image/move06@2x.png" }, { id: 7, src: "../../image/move07@2x.png" }, { id: 8, src: "../../image/move08@2x.png" }, { id: 9, src: "../../image/move09@2x.png" }]
    that.data.select_kind = 0
    that.data.uppoint = 0
    that.data.downpoint = 9
    that.data.currentkind = "../../image/move00@2x.png"
    that.data.marker = []
    that.data.newscount = 0
    that.data.events = []
    that.data.currentid = 0

    that.setData({
      show_array: that.data.show_array,
      currentkind: that.data.currentkind,
      currentid: 0,
      select_kind: that.data.select_kind,
    })
    
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        if (app.globalData.issearch == 0) {
          that.data.current_latitude = res.latitude
          that.data.current_longitude = res.longitude
        }
        else {
          that.data.current_latitude = app.globalData.searchlat
          that.data.current_longitude = app.globalData.searchlong
          app.globalData.issearch = 0
        }

        that.setData({ current_latitude: that.data.current_latitude, current_longitude: that.data.current_longitude })
        wx.request({
          url: app.globalData.mainURL + 'api/getItemsOnMap',
          data: {
            latitude: 45.784396,
            longitude: 126.677736
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (!res.data.status) return;
            wx.getSystemInfo({
              success: function (res2) {
                var brandx = 0
                var brandy = 0
                if (res2.brand == 'iPhone') {
                  brandx = -50
                  brandy = 20
                }
                var iter
                for (iter = 0; iter < res.data.honey.length; iter++) {
                  var str = res.data.honey[iter].amount + "ml"
                  var id = "h" + res.data.honey[iter].no
                  that.data.marker[iter] = {
                    iconPath: "../../image/2.png",
                    id: id,
                    latitude: 1 * (res.data.honey[iter].latitude),
                    longitude: 1 * (res.data.honey[iter].longitude),
                    width: (100 / 750) * res2.screenWidth,
                    height: (50 / 1344) * res2.screenHeight,
                    anchor: { x: 0, y: 1 },
                    kind: "honey",
                    label: {
                      content: str,
                      color: "#000000",
                      fontSize: (20 / 750) * res2.screenWidth,
                      bgColor: "#e6b53c",
                      padding: (3 / 750) * res2.screenWidth,
                      borderWidth: (1 / 750) * res2.screenWidth,
                      borderColor: "#000000",
                      borderRadius: (3 / 750) * res2.screenWidth,
                      x: ((35 + brandx) / 750) * res2.screenWidth,
                      y: ((-36 + brandy) / 1344) * res2.screenHeight
                    }
                  }
                }
                if (iter == res.data.honey.length) {
                  var sites = res.data.site
                  iter = 0
                  var tempPath = []
                  app.globalData.map_idx = 0;
                  var temp = 0;
                  if (sites.length > 0) {
                    wx.showLoading({
                      title: '加载中',
                    })
                  }
                  var obj=[]
                  for(var index=0; index< sites.length; index++){
                    obj[index]=app.globalData.uploadURL + sites[index].site_icon
                  }
                  console.log(sites)
                  if(that.data.file_path.length==0){
                    that.download_icons(sites, 0)
                  }
                  else{
                    wx.getSystemInfo({
                      success: function (res2) {
                        for (var index1 = 0; index1 < that.data.file_path.length; index1++) {
                          that.data.marker.push({
                            iconPath: that.data.file_path[index1],
                            id: 'o' + sites[index1].boss_id,
                            latitude: 1 * sites[index1].latitude,
                            longitude: 1 * sites[index1].longitude,
                            width: (69 / 750) * res2.screenWidth,
                            height: (73 / 1344) * res2.screenHeight,
                            kind: "site",
                          })
                        }
                        that.show_marker()
                      }
                    })
                  }
                  //while (temp < sites.length) {
                    //that.download_icon(res.data.site[temp].site_icon, temp, sites)
                    //that.sleep(10);
                    
                    temp++;
                  //}
                }
              },
            })
          },
        })
      },
      fail(error) {
      }
    })
    var that = this
    /*
    if (app.globalData.see_news == 1) {
      app.globalData.see_news == 0
      that.setData({ newscount: 0 })
      return;
    }
    */
    wx.request({
      url: app.globalData.mainURL + 'api/getNewAlarm',
      data: {
        user_id: app.globalData.userInfo.user_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!res.data.status) return;
        that.setData({ newscount: res.data.news[0].amount * 1 })
      },
    })
  },
  sleep: function (milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds) {
        break;
      }
    }

  },
  download_honey: function (res, res2, iter, brandx, brandy) {
    setTimeout(function () {
    }, 1000)

  },
  download_icons: function(sites, index){
    var obj=[]
    var that=this
    var i=0
    for(var key=0; key<10; key++){
      i=index*10+key
      //console.log(i)
      obj[key] =  sites[i].site_icon
      if (i == sites.length - 1) {
        break
      }
    }
    download.downloadSaveFiles({
      urls: obj,
      success: function (res) {
        console.log(res);
        for(var index1 = 0; index1<obj.length; index1++){
          that.data.file_path[index*10+index1] = res.get(app.globalData.uploadURL + obj[index1]+index1).tempFilePath
        }
        if (i < sites.length - 1) {
          that.download_icons(sites, index + 1)
        }
        else {
          console.log(that.data.file_path)
          wx.getSystemInfo({
            success: function (res2) {
              for (var index1 = 0; index1 < that.data.file_path.length; index1++) {
                that.data.marker.push({
                  iconPath: that.data.file_path[index1],
                  id: 'o' + sites[index1].boss_id,
                  latitude: 1 * sites[index1].latitude,
                  longitude: 1 * sites[index1].longitude,
                  width: (69 / 750) * res2.screenWidth,
                  height: (73 / 1344) * res2.screenHeight,
                  kind: "site",
                })
              }
              that.show_marker()
            }
          })
        }
      },
      fail: function (e) {
        //console.info("下载失败");
      }
    });
  },
  download_icon: function (map_icon, index, sites) {
    var iter = index
    var that = this
    wx.getSystemInfo({
      success: function (res2) {
        console.log(map_icon)
        if(map_icon!="map_icon"){
          wx.downloadFile({
            url: app.globalData.uploadURL + map_icon,
            success: function (res1) {
              var temppath = res1.tempFilePath
              wx.saveFile({
                tempFilePath: temppath,
                success: function (res) {
                  that.data.marker.push({
                    iconPath: res.savedFilePath,
                    id: 'o' + sites[iter].boss_id,
                    latitude: 1 * sites[iter].latitude,
                    longitude: 1 * sites[iter].longitude,
                    width: (69 / 750) * res2.screenWidth,
                    height: (73 / 1344) * res2.screenHeight,
                    kind: "site",
                  })

                  if (app.globalData.map_idx == sites.length - 1) {
                    that.show_marker()
                  }
                  app.globalData.map_idx++
                  //console.log(app.globalData.map_idx)
                },
                fail: function(e){
                  console.log(e)
                }
              })
            }
          })
        }
        else{
          that.data.marker.push({
            iconPath: "/image/Business@2x.png",
            id: 'o' + sites[iter].boss_id,
            latitude: 1 * sites[iter].latitude,
            longitude: 1 * sites[iter].longitude,
            width: (69 / 750) * res2.screenWidth,
            height: (73 / 1344) * res2.screenHeight,
            kind: "site",
          })
          that.sleep(10)
          if (app.globalData.map_idx == sites.length - 1) {
            that.show_marker()
          }
          app.globalData.map_idx++
        }
      }
    })
  },
  show_marker: function (kind = 0, first = 1) {
    console.log(this.data.marker)
    wx.hideLoading()
    var tempmarker = new Array()
    if (kind == 0) {
      this.setData({ markers: this.data.marker })
    }
    else {
      for (var iter = 0; iter < this.data.marker.length; iter++) {
        if (this.data.marker[iter].kind == "honey") {
          tempmarker.push(this.data.marker[iter])
        }
        else if (this.data.marker[iter].kind == "site") {
          if (kind == 0) {
            tempmarker.push(this.data.marker[iter])
            continue
          }
          for (var jter = 0; jter < this.data.events.length; jter++) {
            if (kind != 0 && this.data.events[jter].type * 1 == kind - 1 && 'o' + this.data.events[jter].no == this.data.marker[iter].id && this.data.events[jter].state == 0) {
              tempmarker.push(this.data.marker[iter])
              break;
            }
          }
        }
      }
      console.log(tempmarker)
      this.setData({ markers: tempmarker })
    }
  },
  //marker function
  on_Click_maker: function (event) {
    if (event.markerId[0] == "h") {
      var vip = app.globalData.userInfo.isVIP + 1
      for (var iter = 0; iter < this.data.marker.length; iter++) {
        if (this.data.marker[iter].id == event.markerId) {
          break;
        }
      }
      var origin = [this.data.marker[iter]] //selected honey

      var str = origin[0].label.content
      str = 1 * str.slice(0, str.length - 2) //current honey amount
      var distancex = this.distance(origin[0].latitude, origin[0].longitude, this.data.current_latitude, this.data.current_longitude)
      var flag = 0
      var clickhoney = 0
      if (wx.getStorageSync('user_step') == '') wx.setStorageSync('user_step', '0')
      var step = parseInt(wx.getStorageSync('user_step'))
      var markersin = (step / 2 * vip)
      console.log('------markersin =  ------' + markersin);
      if (app.globalData.daily_honey == '') {
        app.globalData.daily_honey = [0, 0]
      }
      if (distancex < markersin) { //less than markersin
        var rand = 1 + Math.ceil(Math.random() * (app.globalData.rule[5].value * 1 - app.globalData.daily_honey[0]) - 1)         //daily honey getting from map is less than 500
        var rand1 = Math.ceil(parseInt(str) * (0.1 + Math.random() * 0.4));
        if (rand1 < rand) rand = rand1;
        if (rand < 3) {
          flag = 1
          clickhoney = str
        }
        else {
          str -= rand
          clickhoney = rand
        }
      }
      else {
        wx.showToast({
          title: '距离不够，无法采集',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (app.globalData.daily_honey[0] >= app.globalData.rule[5].value) {
        wx.showToast({
          title: '您今天已经收获了' + app.globalData.rule[5].value + 'ml蜂蜜，明天再来哦',
          icon: 'none',
          duration: 1000
        })
        return;
      }
      if (app.globalData.isactivetime == 0) {
        wx.showToast({
          title: '从早上7点开始可以收集蜂蜜',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      var todayarray = wx.getStorageSync("todayselected")
      if(todayarray=='')
      {
        todayarray=[]
      }
      for (var iter = 0; iter < todayarray.length; iter++) {
        if (todayarray[iter] == event.markerId) {
          wx.showToast({
            title: '您已经采集过了',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }

      var honey_info = wx.getStorageSync('honey_info');
      app.globalData.daily_honey[0] += clickhoney;
      honey_info.total_honey = honey_info.total_honey * 1 + clickhoney;
      var total_honey = honey_info.total_honey;
      wx.setStorageSync('honey_info', honey_info)
      todayarray.push(event.markerId)
      wx.setStorageSync("todayselected", todayarray)
      wx.setStorageSync("daily_honey", app.globalData.daily_honey)
      var markernumber = event.markerId.slice(1, event.markerId.length)
      app.globalData.honey_info = honey_info
      console.log(clickhoney)
      var title = '成功收取' + clickhoney + 'ml蜂蜜'
      wx.showToast({
        title: title,
        duration: 2000,
        icon: 'none'
      })
      wx.request({
        url: app.globalData.mainURL + 'api/catchHoney',
        method: 'POST',
        header: {
          'content-type': "application/json"
        },
        data: {
          amount: total_honey,
          no: markernumber,
          user_id: app.globalData.userInfo.user_id,
          honey: clickhoney
        },
        success: function (res) {

        }
      })

      if (flag == 0) {
        origin[0].label.content = str + "ml"
        this.data.marker.push(origin[0])
      }
      this.setData({ markers: this.data.marker })
    }
    else if (event.markerId[0] == "o") {
      var markernumber = event.markerId.slice(1, event.markerId.length)
      wx.navigateTo({
        url: 'detail_gym/detail_gym?id=' + markernumber,
      })
    }
    else { }
  },
  distance: function (lat1, lon1, lat2, lon2) {
    var p = 0.017453292519943295;
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2
    return 12742000 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
  },
  //sidebar functions
  on_click_down: function (event) {
    if (this.data.downpoint < 18) {
      this.data.show_array.shift()
      this.data.downpoint++;
      this.data.uppoint++
      this.data.show_array.push(this.data.item_array[this.data.downpoint])
      this.setData({ show_array: this.data.show_array })
    }
  },
  on_click_up: function (event) {
    if (this.data.uppoint > 0) {
      this.data.show_array.pop()
      this.data.downpoint--;
      this.data.uppoint--
      this.data.show_array.unshift(this.data.item_array[this.data.uppoint])
      this.setData({ show_array: this.data.show_array })
    }
  },
  on_selectkind: function (event) {
    this.setData({ currentkind: this.data.item_array[event.currentTarget.id].src, select_kind: 0, currentid: event.currentTarget.id * 1 })
    this.show_marker(event.currentTarget.id * 1, 0)
  },

  on_click_select_menu: function () {
    this.setData({ select_kind: 1 })
  },
  //searchbox function
  on_click_search: function () {
    wx.navigateTo({
      url: 'search/search',
    })
  },
  on_click_create_event: function () {
    wx.request({
      url: app.globalData.mainURL + 'api/getUserState',
      method: 'post',
      data: {
        'nickname': app.globalData.userInfo.nickname
      },
      success: function (res) {
        app.globalData.userInfo.state = res.data.result[0].state
        if (app.globalData.userInfo.state == 0) {
          wx.showModal({
            title: '提示',
            content: '请先进行身份认证',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../profile/auth/auth',
                })
              } else if (res.cancel) {
              }
            }
          })
          return;
        }
        if (app.globalData.userInfo.state == 3) {
          wx.showModal({
            title: '提示',
            content: '您的身份认证审核未通过，请重新提交',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../profile/auth/auth',
                })
              } else if (res.cancel) {
              }
            }
          })
          return;
        }
        if (app.globalData.userInfo.state == 1) {
          wx.showModal({
            title: '提示',
            content: '您的认证资料已提交，请等待审核通过',
            showCancel: false,
          })
          return;
        }
        wx.navigateTo({
          url: '../other/create_event/create_event',
        })
      }
    })

  },
  on_click_news: function () {
    wx.navigateTo({
      url: 'news/news',
    })
  }
})
