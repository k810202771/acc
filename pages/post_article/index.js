// pages/post_article/index.js
var apiUtils = require('../../utils/apiUtils.js')
var app = getApp()
Page({
  data: {
    images_path: ['/images/post.png'],
    height: 20,
    focus: false,
    article: '',
    info: {}
  },
  onLoad: function (options) {
    var info = wx.getStorageSync('zyx_user')
    if (!info) {
      app.getUserInfo()
      return
    }
    this.setData({
      info: info
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  post_article(e) {
    var that = this
    console.log(e)
    wx.uploadFile({
      url: 'https://zyxart.leanapp.cn/api/v1/moment',
      pic: that.data.images_path,
      name: 'file',
      // header: {}, // 设置请求的 header
      formData: {
        sessiontoken: sessiontoken,
        content: that.data.article
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        // success
        console.log(res)
      },
      fail: function () {
        console.log('faile')
        // fail
      },
      complete: function () {
        // complete
      }
    })


  }
  ,
  item_tap(e) {
    var that = this
    var count = 4 - this.data.images_path.length
    var index = parseInt(e.currentTarget.dataset.i)
    console.log(e)
    if (this.data.images_path.length - 1 == index) {
      wx.chooseImage({
        count: count, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          // success
          console.log(res)
          var temp_array = res.tempFilePaths

          // if(that.data.images_path.length+temp_array.length>=4){
          that.setData({
            images_path: temp_array
          })
          // }



        },
        fail: function () {
          // fail
          console.log('fail')
        },
        complete: function () {
          // complete
          console.log('complete')
        }
      })
    }


  },
  formSubmit(e) {
    console.log(e)
  },
  input(e) {
    this.setData({
      article: e.detail.value
    })
    console.log(e)
  }
})