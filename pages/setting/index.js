
var app = getApp()
Page({
  data:{
    info:{}
   },
  onLoad:function(options){
    var that = this
    // 页面初始化 options为页面跳转所带来的参数
    app.getUserInfo(function(info){
      console.log(info)
    that.setData({
      info:info
    })
    })
   },
  onReady:function(){
    // 页面渲染完成
   },
  onShow:function(){
      wx.setNavigationBarTitle({
        title: '我',
        success: function(res) {
          // success
        }
      })
    // 页面显示
   },
  onHide:function(){
    // 页面隐藏
   },
  onUnload:function(){
    // 页面关闭
   }
})