// pages/me/index.js
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
    if (App.ShareIndexPages(true)) {
      this.setData({
        card: { id: 1, display: true, width: App.globalData.windowdata.screenWidth, pixelRatio: App.globalData.windowdata.pixelRatio }
      })
    }
  }, 
  onShow: function () {
    if (App.ShareIndexPages(true)) {
      var info = wx.getStorageSync('zyx_user');
      //更新用户积分体力值数据
      wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/user/status?sessiontoken=" + info.sessiontoken,
        method: "GET",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(res, info);
          this.setData({
            info: info,
            res: res.data.results
          })
        }.bind(this)
      })
    }
  },
  click:function(res){
    switch (res.currentTarget.dataset.type){
      case "phone":
        wx.makePhoneCall({
          phoneNumber: '15321050878'
        })
      break;
      case "order":
        wx.navigateTo({
          url: "./personal/index"
        })
      break;
      case "exchange":
        wx.navigateTo({
          url: "./exchange/index"
        })
      break;
    }
  }

})