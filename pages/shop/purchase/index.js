// pages/shop/purchase/index.js
App = getApp();
var GetDataUrl = "http://169.f3322.net:81/piaoniu/pnapi.php";
var GetpaymentUrl = "http://169.f3322.net:81/piaoniu/order.php";
var GetDataUrl = "https://www.zhanapp.com.cn/php/zhanapp-php/pnapi.php";
var GetpaymentUrl = "https://www.zhanapp.com.cn/php/zhanapp-php/order.php";
var shopid = 0;
var timer = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radiolist:[
      { icon: 'icon-weixinzhifu', color:'46ae3d',name: 'zhifu', value: '微信支付', checked: 'true' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData(App.globalData.order);
    console.log(this.data);
    console.log(this.data.options);

    switch (options.type){
      case "Placeanorder":
        this.Placeanorder();
        break;
      case "payment":
        shopid = options.id;
        this.paymentZXA();
        break;
        
    }

  },
  //付款
  paymentZXA:function(){
    var that = this;
    wx.showLoading({
      title: "正在拉取数据"
    })
    var info = wx.getStorageSync('zyx_user');
    console.log(info);
    wx.request({
      url: GetpaymentUrl + "?openid=" + info.authData.lc_weapp.openid +"&shopid=" + shopid,
      method: "GET",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        console.log(res);
        let array = res.data.product_title.split("[|||`AXAX`|||]", 2);
        res.data.product_title = array[0];
        this.setData({
          res: { 
            data: { 
              data: {
                time: res.data.date_time.substring(0,10),
                shopid: res.data.shop_id, 
                timeend: res.data.date_time_end.substring(0, 10), 
                sign: res.data.wxsign,
                wxdata: res.data.wxdata
              }
            }
          },
          title: res.data.product_title,
          visibility : true,
          showprice: res.data.product_aprice,
          showpoints:  res.data.product_integral,
          expressXz: parseInt(res.data.product_freight) > 10?"1":"0",
          
        })
        console.log(this.data)
        wx.hideLoading();

        clearInterval(timer);
        //设置订单倒计时
        if (this.data.res.data.data) {

          timer = setInterval(function () {

            var now = new Date(that.data.res.data.data.timeend * 1000).getTime();
            //now.setMinutes(now.getMinutes() + 1);
            var newnow = new Date().getTime() - App.timeDifference;
            var timeal = new Date(now - newnow);

            that.setData({
              time: (now > newnow ? timeal.getMinutes() + "分" + timeal.getSeconds() + "秒" : ""),
              ddzt: now > newnow
            })


          }, 100)

        }

      }.bind(this)
    })
  },
  //下单
  Placeanorder:function(){
    var that = this;
    var info = wx.getStorageSync('zyx_user');

    wx.showLoading({
      title: "正在下单"
    })
    var discountcode = this.data.discountShow === true && this.data.discountnumber && this.data.discountstate == 0 ? "&discount_code=" + this.data.discountnumber:""

    var distribution = wx.getStorageSync('distribution'); //获取分销信息
    console.log(this.data.expressXX);
    console.log("userid=" + info.authData.lc_weapp.openid + discountcode + "&platformType=" + App.globalData.PlatformType + "&productid=" + this.data.productid + "&objectId=" + info.objectId + "&productimg=" + this.data.img + "&field=" + this.data.specificationp + "&producttitle=" + this.data.title.replace(/&/, "") + "&visibility=" + this.data.visibility + "&type=makeorder&count=" + this.data.activityNumber + "&amount=" + (this.data.activityNumber * this.data.saleprice + (this.data.expressXz == 1 ? 10 : 0)) + "&ticketCategoryId=" + this.data.ticketCategoryId + "&ticketGroupId=" + this.data.activityid + "&deliverType=" + this.data.expressXz + "&receiverName=" + this.data.expressXX.name + "&phone=" + this.data.expressXX.onb + "&postage=" + (this.data.expressXz == 1 ? 10 : 0) + "&district=" + this.data.expressXX.dz + "&address=" + this.data.expressXX.wz + (distribution && distribution.id == this.data.productid && distribution.idtype == App.globalData.PlatformType ? "&identifier=" + distribution.identifier : ""))

    wx.request({
      url: GetDataUrl + "?formal=true",
      method: "POST", 
      data: "userid=" + info.authData.lc_weapp.openid + discountcode + "&platformType=" + App.globalData.PlatformType + "&productid=" + this.data.productid + "&objectId=" + info.objectId + "&productimg=" + this.data.img + "&field=" + this.data.specificationp + "&producttitle=" + this.data.title.replace(/&/, "") + "&visibility=" + this.data.visibility + "&type=makeorder&count=" + this.data.activityNumber + "&amount=" + (this.data.activityNumber * this.data.saleprice + (this.data.expressXz == 1 ? 10 : 0)) + "&ticketCategoryId=" + this.data.ticketCategoryId + "&ticketGroupId=" + this.data.activityid + "&deliverType=" + this.data.expressXz + "&receiverName=" + this.data.expressXX.name + "&phone=" + this.data.expressXX.onb + "&postage=" + (this.data.expressXz == 1 ? 10 : 0) + "&district=" + this.data.expressXX.dz + "&address=" + this.data.expressXX.wz + (distribution && distribution.id == this.data.productid && distribution.idtype == App.globalData.PlatformType ? "&identifier=" + distribution.identifier : ""),

      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        console.log(res);
        if (res.data.code == 101) {
          wx.showModal({
            title: "错误",
            showCancel: false,
            content: (res.data? (res.data.data.errorHint ? res.data.data.errorHint : res.data.data.msg ? res.data.data.msg : res.data.msg):""),
            success: function () {
              wx.navigateBack();
            }
          })
        }
        this.setData({
          res: res
        })

        wx.hideLoading();
        
        console.log(App.timeDifference, new Date(that.data.res.data.data.timeend * 1000).getTime(), that.data.res.data.data.timeend * 1000, that.data.res.data.data.timeend,that.data.res.data)
        var now = new Date(that.data.res.data.data.timeend * 1000).getTime();
        var newnow = new Date().getTime() - App.timeDifference;

        that.setData({
          ddzt: now > newnow
        })

        clearInterval(timer);
        //设置订单倒计时.
        if (res.data.data){

          timer = setInterval(function () {

            var now = new Date(that.data.res.data.data.timeend * 1000).getTime();
            //now.setMinutes(now.getMinutes() + 1);
            var newnow = new Date().getTime() - App.timeDifference;
            var timeal = new Date(now - newnow);

            that.setData({
              time: (now > newnow ? timeal.getMinutes() + "分" + timeal.getSeconds() + "秒" : ""),
              ddzt: now > newnow
            })


          }, 100)

        }

      }.bind(this)
    })
  },
  payment:function(){
    var res = this.data.res;
    wx.requestPayment({
      timeStamp: res.data.data.time,
      nonceStr: res.data.data.wxdata.nonce_str,
      package: 'prepay_id=' + res.data.data.wxdata.prepay_id,
      signType: 'MD5',
      paySign: res.data.data.sign,
      success: function (res) {

        wx.showModal({
          title:"支付提醒",
          content:"付款成功！",
          showCancel:false,
          success:function(){

            //设置分销信息
            wx.setStorageSync('distribution', null);

            wx.redirectTo({
              url: "../../me/personal/index?type=update"
            })
          }
        })

      },
      fail: function (res) {
        console.log(res)

        wx.showModal({
          title: "支付提醒",
          content: "付款失败！请重试。",
          showCancel: false
        })

      }
    })
  }
})