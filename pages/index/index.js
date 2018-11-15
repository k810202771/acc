// pages/index/index.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:null
  },
  click:function(e){
    if (e.detail.userInfo) {

      if (!App.globalData.windowdata){

        wx.getSystemInfo({
          success: function (res) {
            App.globalData.windowdata = res;
            App.getUserInfo();
          }.bind(this)
        })

      }else{
        App.getUserInfo();
      }

      
    }else{
      wx.showModal({
        title: '登录失败',
        content: '请重新登录！',
        showCancel:false

      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //清空分销信息
    wx.setStorageSync('distribution', {});

    wx.getSystemInfo({
      success: function (res) {
        App.globalData.windowdata = res;
        //设置data的数据
        this.setData({
          data: res
        })
        //版本更新不在自动登录
        var zyx_user = wx.getStorageSync('zyx_user')
        if (zyx_user) {
          //App.getUserInfoT();
          wx.switchTab({
            url: "../home/index"
          })
        }
      }.bind(this)
    })
  }
})