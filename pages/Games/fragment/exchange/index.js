// pages/Games/fragment/exchange/index.js
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "https://www.zhanapp.com.cn/php/kapian/",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow:function(){
    this.onLoadp();
  },
  onLoadp: function () {
    if (App.ShareIndexPages()){
      this.setData({
        window: App.globalData.windowdata
      }) 
      var that = this;
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      wx.request({
        url: this.data.url + "cardlist.php",
        success: function (res) {
          console.log(res);
          for (var i = 0; i < res.data.length;i++){
            res.data[i].city = App.getChina(res.data[i].city);
          }
          that.setData({
            data: res.data
          })
        },
        complete:function(){
          wx.hideLoading()
        }
      })
    }
  },
  click:function(res){
    var that = this;
    console.log(res.currentTarget.dataset.type);

    wx.chooseAddress({
      success: function (value) {
        that.alert(res, value);
      }.bind(this),
      fail: function (res) {
        if(res.errMsg.indexOf('cancel') == -1){
          wx.openSetting();
        };
      }.bind(this)
    })
    
  },
  alert: function (type, data_city){
    var info = wx.getStorageSync('zyx_user');
    console.log(info);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认您的信息~\n姓名：' + data_city.userName + '\n电话：' + data_city.telNumber + '\n地址：' + data_city.provinceName + data_city.cityName + data_city.countyName + data_city.detailInfo,
      cancelText: '重新选择',
      success: function (res) {
        if (res.confirm) {
          console.log("确定")
          App.Ajax("POST",{
            title: "加载中", 
            url: that.data.url + "exchange.php",
            data: "user_id=" + info.authData.lc_weapp.openid + "&name=" + data_city.userName + "&city=" + data_city.provinceName + data_city.cityName + data_city.countyName + data_city.detailInfo + "&phone=" + data_city.telNumber + "&type=" + type.currentTarget.dataset.type + "&order_id=" + type.currentTarget.dataset.id + "&order_name=" + type.currentTarget.dataset.name + "&order_img=" + type.currentTarget.dataset.img,
            success: function(res){
              console.log(res);
              if (res.data.code == 0 && type.currentTarget.dataset.type == 0){
                wx.requestPayment({
                  timeStamp: res.data.time,
                  nonceStr: res.data.xml.nonce_str,
                  package: "prepay_id=" + res.data.xml.prepay_id,
                  signType: "MD5",
                  paySign: res.data.wxsign,
                  success: function () {
                    wx.showModal({
                      title: '提示',
                      content: "兑换成功，请到个人中心，门票兑换模块查看！",
                      showCancel: false
                    })
                  }
                })

              }else{
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false
                })
              };
            }
          })
        } else if (res.cancel) {
          console.log("取消")
          that.click(type);
        }
      }
    })
  }
})