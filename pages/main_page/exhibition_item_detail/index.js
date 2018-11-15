// pages/exhibition_item_detail/index.js
var apiUtils = require('../../../utils/apiUtils.js')
var utils = require('../../../utils/util.js')
var WxAutoImage = require('../../../utils/WxAutoImage.js')
Page({
  onShareAppMessage: function () {
    return {
      title: this.data.item.nameBase,
      desc: '随时掌控那些不能错过的展览',
      path: 'pages/exhibition_item_detail/index?id=' + this.data.id
    }
  },
  data:{
    id:'',
    item:{},
    size:500,
    cursor:{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  var width = wx.getSystemInfoSync().windowWidth*wx.getSystemInfoSync().pixelRatio
  this.setData({
    size:width
  })
    console.log(options)
    this.setData({
      id:options.id
    })
    this.request_item_data()
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  request_item_data(){
    var that = this;
     apiUtils.AJAX('/v1/item/' + this.data.id, function (res) {
        console.log(res.data)
        that.setData({
          item:res.data.results
        })

     })
  },
   imageLoad: function (e){
    
    var that = this;
    var cursor = this.data.cursor;
    cursor=WxAutoImage.wxAutoImageCal(e)
    that.setData({
      cursor:cursor,
    })
  },
  imgtap(){

    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: [this.data.item.coverUrl.url],
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})