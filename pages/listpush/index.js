// pages/listpush/index.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    App.Ajax("GET", {
      title: "加载中",
      url: "https://www.zhanapp.com.cn/php/bannerEntrance/couplet.json",
      success(res) {
        console.log(res);
        that.setData({
          list:res.data
        })
      }
    })
  },
  click(res){
    var url = '../main_page/zhanxun/index' + '?scene=' + res.currentTarget.dataset.id
    wx.navigateTo({
      url: url
    })
  }
})