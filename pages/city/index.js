// pages/city/index.js
var apiUtils = require('../../utils/apiUtils')
var types = require('../../utils/constant').MAIN_TYPE

var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"上海市",
    page: 1,
    limit: 10,
    list: [],
    img:{
      width:0,
      height:0
    }
  },
  click: function (e) {
    console.log(App.globalData.windowdata);
    var objectId = e.currentTarget.dataset.id
    var url = ''
    switch (e.currentTarget.dataset.type) {
      case "city":
        url = '../citylist/index';
        break;
      case types.zhanxun:
        url = '../main_page/zhanxun/index' + '?id=' + objectId
        break;
      case types.exhibition:
        url = '../main_page/exhibition/index' + '?id=' + objectId
        break;
      case types.book:
        break;
      case types.content:
        url = '../main_page/book_content/index' + '?id=' + objectId + "&type=" + e.currentTarget.dataset.type
        break;
    }
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(App.globalData.windowdata);
    var city = wx.getStorageSync('city');
    if (city) {
      this.setData({
        city: city,
        img:{
          width: parseInt(App.globalData.windowdata.windowWidth),
          height: parseInt(App.globalData.windowdata.windowWidth)
        }
      })
    }
    //载入后只需load'
    this.loading();
  },
  loading: function () {
    var that = this;
    this.data.page = 1;
    this.data.list = [];
    this.onlistdata();
  },
  onlistdata: function () {
    if (!this.data.loadlist) {
      wx.showLoading({
        title: '加载中',
      })
      this.data.loadlist = true;
      wx.request({
        url: encodeURI("https://www.zhanapp.com.cn/Api/v1/" + "discover" + "?page=" + this.data.page + (this.data.city == "其它市" ? "" : "&city=" + this.data.city) + "&limit=" + this.data.limit),
        method: "GET",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            this.data.page++
            for (var i = 0; i < res.data.results.length; i++) {
              this.data.list.push(res.data.results[i])
            }
            this.setData({
              list: this.data.list
            })
            this.data.loadlist = false;
            wx.hideLoading();
            wx.stopPullDownRefresh();
          }
        }.bind(this),
        fail:function(res){
          this.data.loadlist = false;
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '获取失败',
            icon: 'none',
            duration: 2000
          })
        }.bind(this)
      })
    }
  },
  onReachBottom: function () {
    this.onlistdata();
  },
  onPullDownRefresh: function () {
    this.onLoad();
  },
  onShow: function () {
    var city = wx.getStorageSync('city');
    if (city != this.data.city) {
      this.onLoad();
    }
  }
})