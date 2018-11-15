//index.js
//获取应用实例
var apiUtils = require('../../utils/apiUtils')
var types = require('../../utils/constant').MAIN_TYPE
var app = getApp()
Page({
  onShareAppMessage: function () {
    return {
      title: '知亦行',
      desc: '随时掌控那些不能错过的展览',
      path: '/pages/index/index'
    }
  },
  data: {
    tabs: ["那 · 荐", "那 · 展", "那 · 言", "那 · 书"],
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0,
    swiper: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 400,
    zhanxun: {
      page: 1,
      limit: 5
    },
    exhibition: {
      page: 1,
      limit: 5
    },
    book: {
      page: 1,
      limit: 5
    },
    content: {
      page: 1,
      limit: 5
    },
    zhanxunData: [],
    exhibitionData: [],
    bookData: [],
    contentData: [],
    types: types.zhanxun
  },
  //根据类型进入不同页面
  click: function (e) {
    //console.log(JSON.stringify(e))
    //console.log(e.currentTarget.dataset.type)
    var objectId = e.currentTarget.dataset.id
    var url = ''
    console.log(e.currentTarget.dataset.type);
    switch (e.currentTarget.dataset.type) {
      case "gamebanner":
        url = '../Games/index'
        wx.switchTab({
          url:url
        })
        break;
      case types.zhanxun:
        url = '../main_page/zhanxun/index' + '?id=' + objectId
        break;
      case types.exhibition:
        url = '../main_page/exhibition/index' + '?id=' + objectId
        break;
      case types.book:
      case types.content:
        url = '../main_page/book_content/index' + '?id=' + objectId + "&type=" + e.currentTarget.dataset.type
        break;
    }
    console.log(url);
    // var url = ''
    wx.navigateTo({
      url: url
    })
  },
  exhibition_item_click: function (e) {
    wx.navigateTo({
      url: '../main_page/exhibition/index' + '?id=' + e.currentTarget.dataset.id
    })
  },
  book_item_click: function (e) {
    wx.navigateTo({
      url: '../main_page/book_content/index' + '?id=' + e.currentTarget.dataset.id + "&type=book"
    })
  }
  ,
  content_item_click: function (e) {
    wx.navigateTo({
      url: '../main_page/book_content/index' + '?id=' + e.currentTarget.dataset.id + "&type=content"
    })
  },
  onLoad: function () {
//
//
//
//
//
//
//跳转到Game界面
//
//
//
//
//
    /*wx.navigateTo({
      url: "../Games/Over/index"
    })*/
//
//
//
//
//
//
//
//
//
//
//
//
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.sliderWidth) / 2
        });
      }
    });
    this.request_slide_image()
    this.request_discover_data()
    this.request_exhibition_data()

  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
//console.log(e.currentTarget.id)
var type_ = ''
    switch (parseInt(e.currentTarget.id)) {
      
      case 0:
      type_ = types.zhanxun
    
        break;

      case 1:
       type_ = types.exhibition
      
        break;

      case 2:
      type_ = types.content
       
        break;

      case 3:
       type_ = types.book
      
        break;
    }
      this.setData({
          types: type_
        })
    if (e.currentTarget.id == 2 && this.data.contentData.length == 0) {
      this.request_book_content_data('content')
      //console.log('content')
    }

    if (e.currentTarget.id == 3 && this.data.bookData.length == 0) {
      this.request_book_content_data('book')
      //console.log('book')
    }

  },
  //以下为scrollview
  lower: function (e) {
    //console.log('滚动到底部了')
    //console.log(e)
    var zhanxun = this.data.zhanxun;
    zhanxun.page = zhanxun.page + 1;
    this.setData({
      zhanxun: zhanxun,
    })
    this.request_discover_data()
  },
  exhibition_lower: function (e) {
    //console.log('滚动到底部了')
    //console.log(e)
    var exhibition = this.data.exhibition;
    exhibition.page = exhibition.page + 1;
    this.setData({
      exhibition: exhibition,
    })
    this.request_exhibition_data()
  },
  content_lower: function (e) {
    //console.log('滚动到底部了')
    //console.log(e)
    var content = this.data.content;
    content.page = content.page + 1;
    this.setData({
      content: content,
    })
    this.request_book_content_data('content')
  },
  book_lower: function (e) {
    //console.log('滚动到底部了')
    //console.log(e)
    var book = this.data.book;
    book.page = book.page + 1;
    this.setData({
      book: book,
    })
    this.request_book_content_data('book')
  }
  ,
  request_slide_image: function () {
    var that = this;
    apiUtils.AJAX(apiUtils.API_V1 + "slider", function (res) {
      //console.log(res)
      if (!res.data.status) {
        return;
      }
      var bannerData = [{ type: "gamebanner", cover: "https://static.zhanapp.com.cn/downloadFile/banner/onbanner.jpg"}];
      for (var v = 0; v < res.data.results.length;v++){
        bannerData.push(res.data.results[v]);
      }
      console.log(bannerData);

      that.setData({
        swiper: bannerData
      })
    })
  },
  request_discover_data: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.showNavigationBarLoading()
    var that = this;
    apiUtils.AJAX(apiUtils.API_V1 + "discover" + "?page=" + this.data.zhanxun.page + "&limit=" + this.data.zhanxun.limit, function (res) {
      console.log(res.data)
      wx.hideToast()
      wx.hideNavigationBarLoading()
      that.setData({
        zhanxunData: that.data.zhanxunData.concat(res.data.results)
      })
      wx.stopPullDownRefresh()
    })
  },
  request_exhibition_data: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.showNavigationBarLoading()
    var that = this;

    // apiUtils.AJAX(apiUtils.API_V1 + "exhibition/recommend" + "?page=" + this.data.exhibition.page + "&limit=" + this.data.exhibition.limit, function (res) {
    apiUtils.AJAX(apiUtils.API_V1 + "exhibition" + "?page=" + this.data.exhibition.page + "&limit=" + this.data.exhibition.limit, function (res) {


      //console.log(res.data)
      wx.hideToast()
      wx.hideNavigationBarLoading()
      that.setData({
        exhibitionData: that.data.exhibitionData.concat(res.data.results)
      })
       wx.stopPullDownRefresh()
    })
  },
  request_book_content_data: function (type) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.showNavigationBarLoading()
    var that = this;
    var url = ''
    if (type == 'book') {
      url = apiUtils.API_V1 + "book" + "?page=" + this.data.book.page + "&limit=" + this.data.book.limit
    } else {
      url = apiUtils.API_V1 + "content" + "?page=" + this.data.content.page + "&limit=" + this.data.content.limit
    }

    // apiUtils.AJAX(apiUtils.API_V1 + "archives" + "?page=" + this.data.exhibition.page + "&limit=" + this.data.exhibition.limit + "&type=" + type, function (res) {
    apiUtils.AJAX(url, function (res) {
      //console.log(res.data)
      wx.hideToast()
      wx.hideNavigationBarLoading()
      if (type == 'book') {
        that.setData({
          bookData: that.data.bookData.concat(res.data.results)
        })
      } else {
        that.setData({
          contentData: that.data.contentData.concat(res.data.results)
        })
      }
       wx.stopPullDownRefresh()
    })
  }
  ,
  //以上为scrollview
  error: function (e) {
    //console.log(e)
  },
  onPullDownRefresh() {
     switch (this.data.types) {

      case types.zhanxun:
        var zhanxun = this.data.zhanxun
        zhanxun.page = 1;
        this.setData({
          zhanxun: zhanxun,
          zhanxunData: []
        })
        this.request_discover_data()
        break;
      case types.exhibition:
        var exhibition = this.data.exhibition
        exhibition.page = 1;
        this.setData({
          exhibition: exhibition,
          exhibitionData: []
        })
        this.request_exhibition_data()
        break;
      case types.book:
        var book = this.data.book
        book.page = 1;
        this.setData({
          book: book,
          bookData: []
        })
        this.request_book_content_data(types.book)
        break

      case types.content:
        var content = this.data.content
        content.page = 1;
        this.setData({
          content: content,
          contentData: []
        })
        this.request_book_content_data(types.content)
        break;
    }
  }
}
)
