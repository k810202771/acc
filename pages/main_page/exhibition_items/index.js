//index.js
//获取应用实例
//获取应用实例
var apiUtils = require('../../../utils/apiUtils.js')
Page({
   onShareAppMessage: function () {
    return {
      title: '首都博物馆',
      desc: '随时掌控那些不能错过的展览',
      path: 'pages/exhibition_items/index?id=' + this.data.id
    }
  },
  data: {
    /**
         * 页面配置
         */
    winWidth: 0,
    winHeight: 0,
    imagesHeightList: {},
    results: [],
    id: '',
    page: 1,
    limit: 10
  },
  //事件处理函数
  bindViewTap: function () {

  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    this.setData({
      id: options.id
    })
    /**
    * 获取系统信息
    */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    that.request_exhibition_data();
  },
  /**
     * 事件处理
     * scrolltolower 自动加载更多
     */
  scrolltolower: function (e) {

    var that = this;

    this.setData({
      page: this.data.page + 1
    })
    that.request_exhibition_data();
  },

  request_exhibition_data: function () {
    var that = this;
    apiUtils.AJAX('/v1/items?eid=' + this.data.id + '&page=' + this.data.page + '&limit=' + this.data.limit, function (res) {
      console.log(res.data)
      that.setData({
        // results: res.data.results,
        results: that.data.results.concat(res.data.results)
      })
    })
  },
  // WxMasonryImageLoad: function (e) {
  //   var that = this;
  //   console.log(e.detail.height);
  //   var colWidth = (that.data.winWidth - 20) / 2;
  //   var imageId = e.target.id;
  //   var imageOWidth = e.detail.width;
  //   var imageOHeight = e.detail.height;

     

  //   var colImageHeight = imageOWidth * colWidth / imageOHeight;

  //  if(colImageHeight<250){
  //     colImageHeight=250
  //   }

  //   var temImagesHeightList = that.data.imagesHeightList;
  //   temImagesHeightList[imageId] = { width: colWidth, height: colImageHeight }
  //   that.setData({
  //     imagesHeightList: temImagesHeightList
  //   });

  // }
})
