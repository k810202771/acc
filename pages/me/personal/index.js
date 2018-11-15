// pages/personal/index.js
//var GetDataUrl = "http://169.f3322.net:81/piaoniu/order.php";
var GetDataUrl = "https://www.zhanapp.com.cn/php/zhanapp-php/order.php";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:1,
    orderlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  click:function(res){
    var info = wx.getStorageSync('zyx_user');

    switch (res.currentTarget.dataset.type){
      case "cancel": //取消订单
        
        break;
      case "payment": //付款
        wx.navigateTo({
          url: "../../shop/purchase/index?type=payment&id=" + res.currentTarget.dataset.id
        })
        break;
      case "detailed":
        wx.navigateTo({
          url: "../../detailed/index?type=payment&shopid=" + res.currentTarget.dataset.shopid + "&platformtype=" + res.currentTarget.dataset.platformtype + "&openid=" + info.authData.lc_weapp.openid + "&orderlist=" + JSON.stringify(this.data.orderlist[res.currentTarget.dataset.orderlistid])
        })
        break;
    }
  },
  onShow: function (){
    var info = wx.getStorageSync('zyx_user');
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: GetDataUrl + "?openid=" + info.authData.lc_weapp.openid + "&pageindex="  + this.data.index,
      method: "POST",
      data: "",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.length;i++){
          let array = res.data[i].product_title.split("[|||`AXAX`|||]", 2);
          res.data[i].product_title = array[0];
          res.data[i].product_pnnb = array[1];

          switch (res.data[i].platform_type){
            case "0":
              res.data[i].platform_name = "票牛平台"
              res.data[i].p_show = true
              res.data[i].date_time = App.format("YMd", new Date(parseInt(res.data[i].date_time)), "-") + " " + App.format("Hms", new Date(parseInt(res.data[i].date_time)), ":")
            break;
            case "-1":
              res.data[i].platform_name = "知亦行"
              res.data[i].p_show = false
              res.data[i].date_time = App.format("YMd", new Date(parseInt(res.data[i].date_time)), "-") +" "+ App.format("Hms", new Date(parseInt(res.data[i].date_time)), ":")
            break;
          }

          this.data.orderlist.push(res.data[i]);
        }
        if (res.data.length)this.data.index++;
        console.log(this.data.index)
        this.setData({
          orderlist: this.data.orderlist
        })
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }.bind(this)
    })
  },
  onPullDownRefresh: function () {
    this.data.index = 1;
    this.data.orderlist = [];
    this.onShow()
  },
  onReachBottom:function(){
    this.onShow();
  }
})