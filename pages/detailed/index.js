// pages/detailed/index.js
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
  click: function (res) {
    var info = wx.getStorageSync('zyx_user');

    switch (res.currentTarget.dataset.type) {
      case "cancel": //取消订单

        break;
      case "payment": //付款
        wx.navigateTo({
          url: "../shop/purchase/index?type=payment&id=" + res.currentTarget.dataset.id
        })
        break;
      case "dzp":
        this.setData({
          dzpnumber: (res.currentTarget.dataset.number == this.data.dzpnumber ? "" : res.currentTarget.dataset.number)
        })
        break;
    }
  },
  oncopy(){
    var that = this;
    wx.showModal({
      title:"提示",
      content:"可以下单使用，或分享给好友。",
      cancelText:"分享好友",
      confirmText:"复制",
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: that.data.orderlist.code,
          })
          wx.showToast({
            title:"复制成功",
            icon:"success"
          })
        } else if (res.cancel) {
          wx.setClipboardData({
            data: "我有一个优惠码(" + that.data.orderlist.code + ")，在微信小程序\"知亦行博物馆\"的\"" + that.data.options.orderlist.product_title + "\"展览下单时，优惠区域输入即可享用优惠",
          })
          wx.showToast({
            icon: "none",
            title: "复制成功,快发送给朋友吧"
          })
        }
      }
    })
  },
  onLoad: function (options) {
    options.orderlist = JSON.parse(options.orderlist);

    var that = this;

    console.log("I is options",options);
    this.setData({
      options: options
    })
  
    switch (options.platformtype){ //平台类型
      case "0": //票牛
        App.Ajax("GET", {
          title: "加载中",
          url: "https://www.zhanapp.com.cn/php/zhanapp-php/pnapi.php?formal=true&userid=" + options.openid + "&type=orderdetail&orderId=" + options.shopid,
          success(res) {
            console.log(res);
            that.updata(res, options);
          }
        })
        break;
      case "-1": //知亦行
        App.Ajax("GET",{
          title:"加载中",
          url: "https://www.zhanapp.com.cn/openapi/api/v1/order/detail?orderId=" + options.shopid,
          success(res){
            
            console.log(res);
            that.updata(res, options);
          }
        })
        break;
    }
  },
  updata(res, options){
    console.log(res);
    if (res.data.expressInfo) {
      if (res.data.expressInfo.expressEvents) {
        for (var i = 0; i < res.data.expressInfo.expressEvents.length; i++) {
          var strdate = new Date(res.data.expressInfo.expressEvents[i].time);
          res.data.expressInfo.expressEvents[i].timeYstr = App.format("yyyy-MM-dd", strdate);
          res.data.expressInfo.expressEvents[i].timeHstr = App.format("HH:mm:ss", strdate);
        }
      }
    }
    if (res.data.status == 4 || res.data.status == 5) {
      res.data.ticketReceipts = res.data.ticketReceipts && res.data.status != 6 ? res.data.ticketReceipts : [{ serialNumber: options.orderlist.product_pnnb, status: 100 }]
      this.setData({
        dzpnumber: res.data.ticketReceipts[0].serialNumber
      })
    }
    this.setData({
      orderlist: res.data,
    })
    console.log(res.data)

    wx.stopPullDownRefresh();
  }
})