var apiUtils = require('../../../utils/apiUtils.js')
var WxParse = require('../../../wxParse/wxParse.js');
Page({
  data:{
   id:"",
   wxParseData:[],
   resultsData:[],
   comment:[],
   counts: {
      views: 0,
      favor: 0,
      comment: 0
    },
  },
  onLoad:function(options){
      console.log(options.type)

      this.setData({
        id:options.id
      })
  },
  onReady:function(){
    // 页面渲染完成
    this.request_zhanxun_data()
    this.request_comment_data()
  
  },
  onShow:function(){
    // 页面显示
     // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
    title: '',
    success: function(res) {
      // success
    }
  })
  },
  onHide:function(){
    // 页面隐藏
  
  },
  onUnload:function(){
    // 页面关闭
  },
  request_zhanxun_data:function(){
    var that = this;
    apiUtils.AJAX('/v1/group1/articles/'+this.data.id,function(res){
      var counts = {
        views: res.data.results.views,
        favor: res.data.results.favors,
        comment: res.data.results.comments
      }
    that.setData({
      resultsData:res.data.results,
        counts: counts,
    })
     WxParse.wxParse('html',res.data.results.content,that)
    }) 
  },
  request_comment_data:function(){
    var that = this;
    apiUtils.AJAX('/v1/exinformation/'+this.data.id+"/comment",function(res){
      that.setData({
        comment:res.data.results,
      })
    })
  },
   wxParseImgTap: function(e){
    var that = this
    WxParse.wxParseImgTap(e,that)
  },
  wxParseImgLoad: function (e){
    var that = this
    WxParse.wxParseImgLoad(e,that)
  }
})