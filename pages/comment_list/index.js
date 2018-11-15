// pages/comment_list/index.js
var apiUtils = require('../../utils/apiUtils')
Page({
  data: {
    id: '',
    comment:[],
    page:1,
    limit:10
  },
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.request_exhibition_comment()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  request_exhibition_comment() {
    wx.showNavigationBarLoading()
    var that = this;
    apiUtils.AJAX('/v1/comment?objectId=' + this.data.id+'&page='+this.data.page+'&limit='+this.data.limit,function(res){
      console.log(res.data)
      wx.hideNavigationBarLoading()
      that.setData({
        comment:that.data.comment.concat(res.data.results),
       
      })
    })
  },
  lower(){
   this.setData({
     page:this.data.page+1
   })
   
    this.request_exhibition_comment()
  }
})