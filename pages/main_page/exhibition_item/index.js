var apiUtils = require('../../../utils/apiUtils.js')
var WxAutoImage = require('../../../utils/WxAutoImage.js')
Page({
   onShareAppMessage: function () {
    return {
      title: '知亦行',
      desc: '随时掌控那些不能错过的展览',
      path: 'pages/main_page/exhibition_item/index?id=' + this.data.id
    }
  },
  data: {
    current:0,
    flag:0,
    id: '',
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    results: {},
    sizes:[],
    flag:0,
    size:400
  },
  onLoad: function (options) {
    console.log(options)

    this.setData({
      id: options.id
    })
    // 页面初始化 options为页面跳转所带来的参数
    this.request_exhibition_data()
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.setNavigationBarTitle({
      title: '',
      success: function (res) {
        console.log(res)
      }
    })
  },
  request_exhibition_data: function () {
    var that = this;
    apiUtils.AJAX('/v1/items?eid=' + this.data.id+'&page=1&limit=25', function (res) {
      console.log(res.data)
      if(res.data.results.length>25){
        that.setData({
          size:300
        })
      }
      that.setData({
        results: res.data.results,
      })
    })
  },
  change(e){
    console.log(e)
    this.setData({
      current:e.detail.current
    })
  },
  imageLoad: function (e){
    if(this.data.flag==0){
      wx.showNavigationBarLoading()
      wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    }
    var that = this;
    //这里看你在wxml中绑定的数据格式 单独取出自己绑定即可
    // that.setData(WxAutoImage.wxAutoImageCal(e));
    // var sizes = that.data.sizes
    var results = this.data.results;
    if(!results){
      return;
    }
   

    console.log(results)
    results[that.data.flag].sizes=WxAutoImage.wxAutoImageCal(e)
    // sizes.push(WxAutoImage.wxAutoImageCal(e));
    that.setData({
      results:results,
      flag:that.data.flag+1
    })
    
     if(that.data.flag>0&&that.data.flag>=results.length){
       wx.hideNavigationBarLoading()
        wx.hideToast()
     }
  }
})