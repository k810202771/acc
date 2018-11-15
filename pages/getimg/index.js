// pages/getimg/index.js
var App = getApp();
var geturl = 'https://www.zhanapp.com.cn/php/zhanapp-php/getimg/'
var timer,list = [],color = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    img:{
      width:0,
      height:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  home:function(){
    wx.switchTab({
      url: "../home/index"
    })
  },
  ht: function (name, number,cl){
    clearTimeout(timer);
    var nb = parseInt(Math.random()*list.length);
    if (!cl){
      var cl = parseInt(Math.random() * color.length);
    }
    this.setData({
      cl: cl,
      nb: nb,
      img: {
        width: 0,
        height: 0
      },
      bgcolor: "#"+color[cl],
      url: geturl + "index.php?width=" + App.globalData.windowdata.screenWidth * App.globalData.windowdata.pixelRatio + "&height=" + App.globalData.windowdata.screenHeight * App.globalData.windowdata.pixelRatio + "&tn=98010089_dg&ch=2&title=" + list[nb].title + "&img=" + list[nb].img + "&name=" + name + "&number=" + this.data.number + "&text=" + list[nb].text + "&bgcolor=" + color[cl] +"&quality=60"
    })
    wx.showLoading({
      title: '正在生成',
    })
    timer = setTimeout(function(){
      this.ht(name, number, cl);
    }.bind(this),3000)
  },
  onLoad: function (options) {

    //版本更新不在自动登录
    var zyx_user = wx.getStorageSync('zyx_user')
    if (!zyx_user) {
      App.globalData.page = "../getimg/index";
      wx.redirectTo({
        url: "../index/index"
      })
    }

    wx.showLoading({
      title: '加载中',
    })
    var info = wx.getStorageSync('zyx_user');
    this.setData({
      name: info.nickname
    })

    wx.request({
      url: geturl + "nbj.php",
      method: "GET",
      header: { "Content-Type": "Content-type: text/plain;charset=utf-8" },
      success: function (res) {
        this.setData({
          number: res.data
        })

        wx.request({
          url: geturl + "getlist.json",
          method: "GET",
          header: { "Content-Type": "Content-type: text/plain;charset=utf-8" },
          success: function (res) {
            console.log(res);
            color = res.data.color;
            list = res.data.list;
            this.ht(this.data.name, 100);
            wx.hideLoading();

          }.bind(this)
        })


      }.bind(this)
    })
    
  },
  dw:function(){
    wx.showLoading({
      title: '下载中',
    })
    wx.downloadFile({
      url: encodeURI(geturl + "index.php?width=" + App.globalData.windowdata.screenWidth * App.globalData.windowdata.pixelRatio + "&height=" + App.globalData.windowdata.screenHeight * App.globalData.windowdata.pixelRatio + "&tn=98010089_dg&ch=2&title=" + list[this.data.nb].title + "&img=" + list[this.data.nb].img + "&name=" + this.data.name + "&number=" + this.data.number + "&text=" + list[this.data.nb].text + "&bgcolor=" + color[this.data.cl] + "&quality=100&type=max"),
      success:function(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success:function(){
            wx.hideLoading();
            wx.showModal({
              title:"下载成功",
              content:"快去分享到朋友圈，让更多人关注博物馆日。",
              showCancel:false
            })
          },
          fail: function (res) {
            wx.openSetting()
          }
        })
      },
    })
  },
  us:function(){
    this.ht(this.data.name, 100);
  },
  loadend:function(){
    wx.hideLoading();
    clearTimeout(timer);
    this.setData({
      img: {
        width: "100%",
        height: "100%"
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title:"世界博物日变身国宝守护人",
      path:"pages/getimg/index",
      imageUrl: "https://static.zhanapp.com.cn/downloadFile/banner/18fx.jpg"
    }
  }
})