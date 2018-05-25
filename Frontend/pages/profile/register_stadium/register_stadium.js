// pages/profile/register_stadium/register_stadium.js
const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_path: "",                       //path of icon
    image_path: ["", "", "", "", ""],    //path of images
    selected:0,                          //the index of image the user might select
    select:[1,0,0,0,0],                  //state of images to view
    display:["display:none;",""],         //style information of images
    introduction: '',                     //introduction of site
    service: '',                           //service comment of site
    method: 'new',
    image_buf:[],
    icon_buf: '',
    isimage: 0,
    isavatar: 0,
    overimagecount: 0,
    overavatarsize: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("ONLOAD")
    var that = this;
    wx.request({
      url: app.globalData.mainURL+"api/getSiteStatus",
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      data:{
        'user_id': app.globalData.userInfo.user_id
      },
      success: function(res)
      {
        if(res.data.status==true)
        {
            that.setData({
               icon_path: app.globalData.uploadURL + res.data.result[0].site_icon,
               icon_buf: app.globalData.uploadURL + res.data.result[0].site_icon,
               introduction: res.data.result[0].site_introduction,
               service: res.data.result[0].site_service
            });
            var select_buf = that.data.select;
            var image = that.data.image_path;
            var select = 0;
            for(var index=0; index<res.data.picture.length; index++)
            {
              select_buf[index+1] = 1;
              select++;
              image[index] = app.globalData.uploadURL + res.data.picture[index].picture;
            }
            that.data.isavatar = 1
            that.data.isimage = res.data.picture.length
            that.setData({
              image_buf: image,
              image_path: image,
              select: select_buf,
              selected: select,
              method: 'change'
            })
        }
      }
    })
  },
  onShow:function()
  {
    console.log("ONSHOW")
  },
  onReady:function()
  {
    console.log("ONREADY")
  },
  onHide:function()
  {
    console.log("ONHIDE")
  },
  on_click_selectavatar: function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        if (res.tempFiles[0].size > 5120000) {
          that.data.overavatarsize ++;
        }
        that.setData({ icon_path: res.tempFilePaths[0] })
        that.data.isavatar = 1
      },
    })
  },
  on_click_image: function (e) {
    var that = this;
    var id = e.target.id;
    if(id>=that.data.selected)
    wx.chooseImage({
      count:1,
      success: function (res) {
        var image = that.data.image_path;
        if (res.tempFiles[0].size > 10485760) {
          that.data.overimagecount++;
        }
        image[that.data.selected] = res.tempFilePaths[0];
        that.setData({ image_path: image, selected: that.data.selected+1 })
        var select_buf = that.data.select;
        select_buf[that.data.selected] = 1;
        that.data.isimage ++
        that.setData({ select: select_buf })
      },
    })
  },
  on_click_delete:function(event)
  {
    var that = this;
    var image = that.data.image_path;
    var select_buf = that.data.select;
    var id=event.target.id;
    if(id<4){
      var index = 0;
      for(index = id; index<4; index++)
      {
        image[index] = image[1*index+1];
        select_buf[index] = select_buf[1 *index+1];
      }
      image[4] = '';
      select_buf[4] = 0;
    }
    else{
      image[4] = '';
      select_buf[4] = 1;
    }
    that.data.isimage--
    that.setData({
      image_path: image,
      select: select_buf,
      selected: that.data.selected-1
    })
  },
  blur_on_introduction: function(event){
    this.setData({ introduction: event.detail.value })
  },
  blur_on_service: function(event)
  {
    this.setData({ service: event.detail.value })
  },
  on_click_save: function()
  {
    var that = this;
    if (that.data.introduction == undefined) {
      wx.showToast({
        title: '请填写场馆介绍',
        icon: 'none'
      })
      return;
    }
    if (that.data.service.length == undefined ) {
      wx.showToast({
        title: '请填写服务介绍',
        icon: 'none'
      })
      return;
    }
    if (that.data.introduction.length == 0) {
      wx.showToast({
        title: '请填写场馆介绍',
        icon: 'none'
      })
      return;
    }
    if (that.data.service.length == 0) {
      wx.showToast({
        title: '请填写服务介绍',
        icon: 'none'
      })
      return;
    }
    if (that.data.isavatar == 0) {
      wx.showToast({
        title: '请上传场馆图标',
        icon: 'none'
      })
      return;
    }
    console.log(that.data.isimage)
    if(that.data.isimage == 0)
    {
      wx.showToast({
        title: '请上传场馆图片',
        icon: 'none'
      })
      return;
    }
    if (that.data.overimagecount != 0) {
      wx.showToast({
        title: '上传的场馆图片不能超过5M',
        icon: 'none'
      })
      return;
    }
    if (that.data.overavatarsize != 0) {
      wx.showToast({
        title: '上传的场馆图标不能超过5M',
        icon: 'none'
      })
      return;
    }
    var requestURL = app.globalData.mainURL+'api/';
    if(that.data.method=='new'){
      requestURL += 'addSiteInfo';
    }
    else{
      requestURL += 'editSiteInfo';
    }
    var tempFilePath = that.data.icon_path;
    console.log(requestURL)
    if(tempFilePath != that.data.icon_buf){
      wx.uploadFile({
        url: requestURL,
        filePath: tempFilePath,
        name: 'file',
        formData:{
          'introduction': that.data.introduction,
          'service': that.data.service,
          'user_id': app.globalData.userInfo.user_id
        },
        success: function(res)
        {
          for (var index = 0; index < that.data.image_path.length; index++) {
            tempFilePath = that.data.image_path[index];
            console.log(tempFilePath)
            var index_buf = 0
            if (tempFilePath != '') {
              if (that.data.method != 'new') {
                for (; index_buf < that.data.image_buf.length; index_buf++) {
                  if (tempFilePath == that.data.image_buf[index_buf]) {
                    var path = that.data.image_buf[index_buf].split('/');
                    tempFilePath = path[path.length - 1];
                    wx.request({
                      url: app.globalData.mainURL + 'api/addSitePictureURL',
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      data: {
                        'user_id': app.globalData.userInfo.user_id,
                        'image': tempFilePath
                      }
                    })
                    break;
                  }
                }
                if (index_buf == that.data.image_buf.length) {
                  wx.uploadFile({
                    url: app.globalData.mainURL + 'api/addSitePicture',
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                      'user_id': app.globalData.userInfo.user_id
                    }
                  })
                }
              }
              else {
                wx.uploadFile({
                  url: app.globalData.mainURL + 'api/addSitePicture',
                  filePath: tempFilePath,
                  name: 'file',
                  formData: {
                    'user_id': app.globalData.userInfo.user_id
                  }
                })
              }
            }
          }
          wx.showLoading({
            title: '上传中'
          })
          setTimeout(function () {
            wx.hideLoading()
            app.globalData.have_stadium = 1
            wx.setStorageSync("have_stadium", 1)
            wx.switchTab({
              url: '../profile',
            })
          }, 3000)
        }
      })
    }
    else {
      var path = that.data.icon_path.split('/');
      tempFilePath = path[path.length - 1];
      wx.request({
        url: requestURL+'1',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          'site_icon': tempFilePath,
          'introduction': that.data.introduction,
          'service': that.data.service,
          'user_id': app.globalData.userInfo.user_id
        },
        success: function()
        {
          for (var index = 0; index < that.data.image_path.length; index++) {
            tempFilePath = that.data.image_path[index];
            console.log(tempFilePath)
            var index_buf = 0
            if (tempFilePath != '') {
              if (that.data.method != 'new') {
                for (; index_buf < that.data.image_buf.length; index_buf++) {
                  if (tempFilePath == that.data.image_buf[index_buf]) {
                    var path = that.data.image_buf[index_buf].split('/');
                    tempFilePath = path[path.length - 1];
                    wx.request({
                      url: app.globalData.mainURL + 'api/addSitePictureURL',
                      method: 'POST',
                      header: {
                        'content-type': 'application/json'
                      },
                      data: {
                        'user_id': app.globalData.userInfo.user_id,
                        'image': tempFilePath
                      }
                    })
                    break;
                  }
                }
                if (index_buf == that.data.image_buf.length) {
                  wx.uploadFile({
                    url: app.globalData.mainURL + 'api/addSitePicture',
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                      'user_id': app.globalData.userInfo.user_id
                    }
                  })
                }
              }
              else {
                wx.uploadFile({
                  url: app.globalData.mainURL + 'api/addSitePicture',
                  filePath: tempFilePath,
                  name: 'file',
                  formData: {
                    'user_id': app.globalData.userInfo.user_id
                  }
                })
              }
            }
          }
          wx.showLoading({
            title: '上传中'
          })
          setTimeout(function () {
            wx.hideLoading()
            app.globalData.have_stadium = 1
            wx.setStorageSync("have_stadium", 1)
            wx.switchTab({
              url: '../profile',
            })
          }, 3000)
        }
      })
    }
  }
})