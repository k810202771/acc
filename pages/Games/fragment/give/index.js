var App = getApp();
// pages/Games/fragment/give/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://www.zhanapp.com.cn/php/kapian/",
    code: 0
  },
  click:function(res){
    var info = wx.getStorageSync('zyx_user');
    var that = this;

    console.log(res);
    switch(res.currentTarget.dataset.type){
      case "receive":
        wx.request({
          url: this.data.url + "index.php?userid=" + info.authData.lc_weapp.openid+ "&type=give&Indexesid=" + this.data.Indexesid,
          success: function (res) {
            console.log(res.data.msg);
            that.setData({
              code: res.data.code
            })
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
        })
        break;
      case "onpage":
        wx.redirectTo({
          url: "../index"
        })
        break;
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
    this.data.Indexesid = options.scene;

    var that = this;
    var info = wx.getStorageSync('zyx_user');
    if (App.ShareIndexPages()){

      wx.showLoading({
        title: "获取中",
        mask: true
      })

      wx.request({
        url: this.data.url + "index.php?userid=" + info.authData.lc_weapp.openid + "&type=give&see=true&Indexesid=" + this.data.Indexesid,
        success: function (res) {
          console.log(res);
          wx.hideLoading();
          that.setData({
            code: res.data.code
          })
          if (res.data.code == 1) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false
            })
          }
          var nickname = res.data.data[0].nickname;
          
          that.setData({
            name: nickname.indexOf('[[[[[||||') == -1 ? nickname : App.decode64(nickname.substring("[[[[[||||".length)),
            cardname: res.data.data[1].data[res.data.data[0].cardid - 1].name,
            cardindex: res.data.data[0].cardid
          })


        }
      })

    };

  }
})