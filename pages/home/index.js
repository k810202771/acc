var apiUtils = require('../../utils/apiUtils')
var types = require('../../utils/constant').MAIN_TYPE
var App = getApp();

Page({
  data:{
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 400,
    page:1,
    limit:10,
    list:[],
    city:"上海市",
    loadlist:false,
    treasureBox:false
  },
  onlonadx:function(){
    var city = wx.getStorageSync('city');
    if (!city) {
      wx.getLocation({
        success: function (res) {
          wx.request({
            url: "https://www.zhanapp.com.cn/php/urlget.php?c=gb18030&url=http://apis.map.qq.com/jsapi?qt=rgeoc&lnglat=" + res.longitude + "%2C" + res.latitude,
            method: "GET",
            header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            success: function (res) {
              this.setData({
                city: res.data.detail.results[0].c
              })
              wx.setStorageSync('city', this.data.city);
              this.loading();
            }.bind(this)
          })
        }.bind(this)
      })
    }
  },
  onLoad:function(){

      ////插入获取分辨率
      wx.getSystemInfo({
        success: function (res) {
          App.globalData.windowdata = res;

            this.onlonadx();
            var city = wx.getStorageSync('city');
            if (city) {
              this.setData({
                city: city
              })
            }
            wx.getSystemInfo({
              success: function (res) {
                this.setData({
                  data: res
                })
                //载入后只需load'
                this.loading();
                /*wx.navigateTo({
                  url: "../getimg/index"
                })*/
              }.bind(this)
            })




        }.bind(this)
      })


    //}
  },
  loading:function(){
    var that = this;
    this.data.page = 1;
    this.data.list = [];
    apiUtils.AJAX(apiUtils.API_V1 + "slider", function (resp) {
      if (!resp.data.status) {
        return;
      }
      /*var bannerData = [{
        type: "gamebanner", 
        page: '/pages/Games/video/index',
        cover: "https://static.zhanapp.com.cn/video/banner.jpg"},{
        type: "gamebanner",
          page: '/pages/Games/fragment/index',
        cover: "https://static.zhanapp.com.cn/downloadFile/card.jpg"
        }];
      
      for (var v = 0; v < res.data.results.length; v++) {
        bannerData.push(res.data.results[v]);
      }*/

      wx.request({
        url:"https://www.zhanapp.com.cn/php/bannerEntrance/banner.json",
        success(res){
          var bannerData = [];
          for (var v = 0; v < res.data.length; v++) {
            if (res.data[v].type == "box"){
              that.setData({
                treasureBox: res.data[v].value
              })
            }else{
              bannerData.push({
                type: "gamebanner",
                page: res.data[v].page,
                cover: res.data[v].img
              });
            }
          }
          bannerData = bannerData.concat(resp.data.results)
          that.setData({
            swiper: bannerData
          })
          console.log(that.data.swiper);
        }
      })
    })
    this.onlistdata();
  },
  onlistdata:function(){
    if (!this.data.loadlist){
      wx.showLoading({
        title: '加载中',
      })
      this.data.loadlist = true;
      wx.request({
        url: encodeURI("https://www.zhanapp.com.cn/api/v1/exinfo?page=" + this.data.page + (this.data.city == "其它市" ? "" : "&city=" + this.data.city) + "&limit=" + this.data.limit),
        method: "GET",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(App.timeDifference);
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
        fail: function (res) {
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
  onShareAppMessage: function (res) {
    title = '知亦行博物馆，看那些没有看过的展览！';
    return {
      title: title,
      path: '/pages/home/index',
      success: function () {
        wx.showModal({
          title: '提示',
          content: '分享成功！',
          showCancel: false
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '赠送失败',
          content: '您可能取消了赠送',
          showCancel: false
        })
      }
    }


  },
  onReachBottom:function(){
    this.onlistdata();
  },
  //根据类型进入不同页面
  click: function (e) {
    console.log(e);

    var objectId = e.currentTarget.dataset.id
    var url = ''
    switch (e.currentTarget.dataset.type) {
      case "gamebanner":
        //url = '../Games/index'
        /*wx.switchTab({
          url: url
        })*/
        //18日国宝守护人生成图片入口
        //url = '../getimg/index'
        //集卡入口
        url = e.currentTarget.dataset.page//'../Games/video/index'
        break;
      case "city":
        url = '../citylist/index'
        break;
      case "zhanxun":
        url = '../main_page/zhanxun/index' + '?scene=' + objectId
        break;
      case "exhibition_information":
        url = '../main_page/zhanxun/index' + '?scene=' + objectId
        break;
      case "openbox":
        url = '../Activepage/openbox/index'
        break;
    }
    wx.navigateTo({
      url: url
    })
  },
  onPullDownRefresh:function(){
    this.onLoad()
  },
  onShow:function(){
    if (!App.globalData.windowdata){
      wx.getSystemInfo({
        success: function (res) {
          if (App.globalData.page) {
            wx.switchTab({
              url: App.globalData.page
            })
            wx.navigateTo({
              url: App.globalData.page
            })
            App.globalData.page = false;
          }
          var city = wx.getStorageSync('city');
          if (city != this.data.city) {
            this.onLoad();
          }
        }.binde(this)
      })
    }else{
      if (App.globalData.page) {
        wx.switchTab({
          url: App.globalData.page
        })
        wx.navigateTo({
          url: App.globalData.page
        })
        App.globalData.page = false;
      }
      var city = wx.getStorageSync('city');
      if (city != this.data.city) {
        this.onLoad();
      }
    }


  }
})