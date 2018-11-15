// pages/shop/choice/index.js
var ajaxurl = "http://169.f3322.net:81/piaoniu/pnapi.php";
var ajaxurl = "https://www.zhanapp.com.cn/php/zhanapp-php/pnapi.php";
//method.js
var method = require('../../../utils/method.js')
var app = getApp();
//?userid=5ad6089bee920a0046c3c28a&type=detail&activityId=12895
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  activity:function(id){
    for (var i = 0; i < this.data.activityEvents.length; i++) {
      if (this.data.activityEvents[i].id == id) {
        
        this.setData({
          activity: this.data.activityEvents[i].ticketCategories
        })
      }
    }
  },
  activityBz: function (id) {
    for (var i = 0; i < this.data.activity.length; i++) {
      if (this.data.activity[i].ticketGroup){
        if (this.data.activity[i].ticketGroup.ticketGroupId == id) {
          this.setData({
            activityBz: this.data.activity[i]
          })
        }
      }
    }
  },
  upclick(id){
    var activityEvents = this.data.activityEvents;
    console.log(activityEvents);
    for (var i = 0; i < activityEvents.length;i++){
      if(activityEvents[i].id == id){
        var ticketCategories = activityEvents[i].ticketCategories;
        for (var to = 0; to < ticketCategories.length;to++){
          if(ticketCategories[to].ticketGroup.selling > 0){
            this.activityBz(ticketCategories[to].ticketGroup.ticketGroupId);
            console.log(ticketCategories[to].ticketGroup.deliverTypes, ticketCategories[to].ticketGroup.salePrice, ticketCategories[to].originPrice, ticketCategories[to].ticketGroup.ticketGroupId, ticketCategories[to].ticketGroup.selling, ticketCategories[to].specification)
            this.setData({
              express: ticketCategories[to].ticketGroup.deliverTypes,
              saleprice: ticketCategories[to].ticketGroup.salePrice,
              originPrice: ticketCategories[to].originPrice,
              activityid: ticketCategories[to].ticketGroup.ticketGroupId,
              ticketCategoryId: ticketCategories[to].ticketGroup.ticketCategoryId,
              selling: this.data.options.group === "true" ? 1 :ticketCategories[to].ticketGroup.selling,
              specification: ticketCategories[to].specification
            })
            if (this.data.activityNumber > this.data.selling) {
              this.setData({
                activityNumber: 1
              })
            }

          }
        }
        break;
      }
    }
  },
  click:function(obj){
    switch (obj.currentTarget.dataset.type){
      case 'detailDes':
        this.setData({
          selling: 0,
          activityid: 0,
          ticketCategoryId: obj.currentTarget.dataset.tId,
          x_activityEvents: obj.currentTarget.dataset.id
        })

        this.activity(this.data.x_activityEvents);
        this.setData({
          specificationp: obj.currentTarget.dataset.specificationp
        })
        this.upclick(obj.currentTarget.dataset.id);

        break;
      case 'activity':
        this.activityBz(obj.currentTarget.dataset.id);
        console.log(obj.currentTarget.dataset.saleprice, obj.currentTarget.dataset.id, obj.currentTarget.dataset.selling, obj.currentTarget.dataset.specification)
        this.setData({
          express: this.data.activityBz.ticketGroup.deliverTypes,
          saleprice:obj.currentTarget.dataset.saleprice,
          originPrice: obj.currentTarget.dataset.originprice,
          activityid: obj.currentTarget.dataset.id,
          ticketCategoryId: obj.currentTarget.dataset.tId,
          selling: this.data.options.group == "true"?1:obj.currentTarget.dataset.selling,
          specification: obj.currentTarget.dataset.specification
        })
        if (this.data.activityNumber > this.data.selling) {
          this.setData({
            activityNumber: 1
          })
        }
        break;
      case 'number':
        this.setData({
          activityNumber: obj.currentTarget.dataset.number
        })
        break;
      case 'shop':
        app.globalData.order = this.data;
        if (this.data.saleprice && this.data.activityNumber && this.data.express.length > 0 && this.data.activityid && this.data.detailDesc != undefined && this.data.selling > 0){
          if (this.data.activityEvents.length >= 25){
            wx.showModal({
              title: "提示",
              cancelText: "重新选择",
              content: "请确定您的购票日期" + this.data.specificationp,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "../order/index"
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.redirectTo({
              url: "../order/index"
            })
          }


        }else{
          wx.showModal({
            title:"参数不全",
            showCancel: false,
            content:"此票档参数不全，不能购买，请选择其他票档。"
          })
        }
        break;
    }
    //刷新显示价格
    this.upshowprice();


  },
  bindDateChange:function(res){
    console.log(res);
    for (var i = 0; i < this.data.activityEvents.length;i++){
      console.log(res.detail.value, app.format("YMd", new Date(this.data.activityEvents[i].start),"-"))
      if(res.detail.value == app.format("YMd", new Date(this.data.activityEvents[i].start),"-")){

        var p = {
          currentTarget: {
            dataset: {
              type: "detailDes",
              id: this.data.activityEvents[i].id,
              specificationp: this.data.activityEvents[i].specification
            }
          }
        }
        break;
      }

    }
    console.log(p);
    this.click(p)
  },
  onLoad: function (options) {
    if (App.ShareIndexPages()) {
      this.data.options = options;

      if(!options.id){
        var c = options.scene.split(/,/, 2)
        var c = options.scene.split(/%2C/, 2)

        console.log(c);
        options = {id:c[0],type:c[1]}
        app.globalData.PlatformType = options.type;

      }
      this.onloadorder(options);

    }
  },
  upshowprice: function (){
    var max = this.data.discount == undefined?0.97:method.cy(100 - this.data.discount, 0.01);
    console.log(max);
    var showpoints = 0;
    var showprice = parseInt(method.cy(method.cy(this.data.saleprice, 100), max) * this.data.activityNumber) / 100;
    if (this.data.points > this.data.saleprice * 100 * this.data.activityNumber - showprice * 100) {
      showpoints = method.jq(method.cy(this.data.saleprice, method.cy(this.data.activityNumber, 100)), method.cy(showprice, 100));
    } else {
      showpoints = this.data.points;
      showprice = ((this.data.saleprice * 100 * this.data.activityNumber - this.data.points) / 100).toFixed(2);
    }
    console.log(this.data.activityNumber );
    this.setData({
      showprice: parseFloat(showprice),
      showpoints: parseFloat(showpoints),
      showoriginprice: this.data.saleprices?this.data.saleprices[this.data.activityNumber - 1]:this.data.originPrice * this.data.activityNumber 
    })
  },
  onloadorder: function (options){
    wx.showLoading({
      title:"正在获取"
    })
    var info = wx.getStorageSync('zyx_user');
    var res = wx.getStorageSync('shopjson');
    var productid = options.id;
    var that = this;
    var url = "";
    switch (options.type){
      case "1":
        url = ajaxurl + "?userid=" + info.authData.lc_weapp.openid + "&type=detail&activityId=" + productid + "&formal=true";
      break;
      case "-1":
        url = "https://www.zhanapp.com.cn/openapi/api/v1/activities?activityId=" + productid;
      break;
    }
    wx.request({
      url: url,
      method: "GET",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        if(options.type == -1){
          res.data = res.data.results
        }
        wx.setStorageSync('shopjson', res);
        //载入成功获取积分情况
        wx.request({
          url: "https://www.zhanapp.com.cn/Api/v1/wxapp/user/status?userid=" + info.objectId,
          method: "GET",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (data) {

            App.timeDifference = new Date() - new Date(data.header.Date).getTime();

            console.log(res, data.data.results.points);
            //取出购票须知
            for (var i = 0; i < res.data.details.length; i++) {
              if (res.data.details[i].type == 5) {
                var detailDesc = res.data.details[i].detailDesc
                break;
              }
            }
            
            var activityid, selling, saleprice = 0, express = [], status, originPrice = 0, points = data.data.results.points, specification, specificationp, expressXz, x_activityEvents, saleprices = null;
            //取出第一个商品id

            for (var i = 0; i < res.data.activityEvents.length; i++) {
              if (res.data.activityEvents[i].ticketCategories){
                for (var b = 0; b < res.data.activityEvents[i].ticketCategories.length; b++) {
                  console.log(res.data.activityEvents[i]);
                  if (res.data.activityEvents[i].ticketCategories[b].ticketGroup) {
                    if (res.data.activityEvents[i].ticketCategories[b].ticketGroup.ticketGroupId) {

                      var x_activityEvents = res.data.activityEvents[i].id;//场次id
                      var activityid = res.data.activityEvents[i].ticketCategories[b].ticketGroup.ticketGroupId;//商品id
                      var ticketCategoryId = res.data.activityEvents[i].ticketCategories[b].ticketGroup.ticketCategoryId;//票档id
                      var selling = options.group === "true"?1:res.data.activityEvents[i].ticketCategories[b].ticketGroup.selling;//数量
                      var originPrice = res.data.activityEvents[i].ticketCategories[b].originPrice;//价格
                      var saleprice = res.data.activityEvents[i].ticketCategories[b].ticketGroup.salePrice;//出售价格
                      if (!saleprice){
                        saleprices = res.data.activityEvents[i].ticketCategories[b].ticketGroup.priceList
                        saleprice = res.data.activityEvents[i].ticketCategories[b].ticketGroup.priceList[0]
                      }
                      console.log("价格：" + saleprice, "数量：" + selling);
                      //priceList

                      var express = res.data.activityEvents[i].ticketCategories[b].ticketGroup.deliverTypes;//购买方式
                      var status = res.data.activityEvents[i].ticketCategories[b].status;
                      var specification = res.data.activityEvents[i].ticketCategories[b].specification;
                      var specificationp = res.data.activityEvents[i].specification;

                      var activityNumber = 1;
                      break;
                    }
                  }
                }
              }
              if (activityid) break;
            }

            if (!detailDesc){
              detailDesc="无";
            }
            if (!activityid) {
              activityid = -1;
              ticketCategoryId = -1;
              var activityNumber = -1;
            };
            if (!ticketCategoryId) {
              activityid = -1;
              ticketCategoryId = -1;
              var activityNumber = -1;
            };
            if (express.length>0){
              expressXz = express[0].type;
            }

            //express.push({ type: 3 });
            //express.push({ type: 5 });
            that.setData({
              ticketCategoryId: ticketCategoryId,
              saleprices: saleprices,
              productid: productid,
              title: res.data.name,
              img: res.data.poster,
              detailDesc: detailDesc,
              x_activityEvents: x_activityEvents,
              activityid: activityid,
              activityEvents: res.data.activityEvents,
              activityNumber: activityNumber,
              selling: selling,
              originPrice: originPrice,
              saleprice: saleprice,
              express: express,
              expressXz: expressXz,
              status: status,
              points: points,
              specification: specification,
              specificationp: specificationp,
              startDate: app.format("YMd", new Date(res.data.activityEvents[0].start), "-"),
              endDate: app.format("YMd", new Date(res.data.activityEvents[res.data.activityEvents.length - 1].start), "-"),
              discount:res.data.discount
            })
            that.activity(that.data.x_activityEvents);
            //刷新显示价格
            that.upshowprice();
            //隐藏
            wx.hideLoading();


          }
        })
    
      },
      fail:function(){
        //隐藏
        wx.hideLoading();
        this.onloadorder();
      }
    })
  }
})