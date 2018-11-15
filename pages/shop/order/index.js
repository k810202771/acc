var method = require('../../../utils/method.js')
// pages/shop/order/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visibility:true,
    discountShow:false,
    expressXX: {},
    ptype:"知亦行"
  },
  switchChange:function(res){
    switch (res.target.dataset.type){
      case "discount":
        this.setData({
          discountShow: res.detail.value
        })
        switch (res.detail.value){
          case true:
           this.setData({
             showprice: this.data.showpriced
           })
          break;
          case false:
            this.setData({
              discounttext: "",
              showprice: this.data.showpricel
            })
          break;
        }
        break;
      case "visibility":
        this.setData({
          visibility: res.detail.value
        })
        break;
    }

    
  },
  click: function (res) {
    console.log(res.currentTarget.dataset.type)
    switch(res.currentTarget.dataset.type){
      case "express":

        this.setData({
          expressXz:res.currentTarget.dataset.expresstype
        })
        
        break;
      case "expressXX":
        wx.chooseAddress({
          success: function (res) {
            console.log(res)

            wx.setStorageSync('data-city', res);
            this.setData({
              expressXX: {
                name: res.userName,
                onb: res.telNumber,
                dz: res.provinceName + res.cityName + res.countyName,
                provinceName: res.provinceName,
                cityName: res.cityName,
                countyName: res.countyName,
                wz: res.detailInfo
              }
            })
          }.bind(this),
          fail:function(){
            if (!this.data.expressXX){
              wx.openSetting();
            }
          }.bind(this)
        })
        break;
      case "placeorder":
        var res = {
          userName: this.data.expressXX.name,
          telNumber: this.data.expressXX.onb,
          provinceName: this.data.expressXX.provinceName,
          cityName: this.data.expressXX.cityName,
          countyName: this.data.expressXX.countyName,
          detailInfo: this.data.expressXX.wz,
        }
        wx.setStorageSync('data-city', res);
        app.globalData.order = this.data;
        if (this.data.expressXX.name && this.data.expressXX.onb && this.data.expressXX.dz){
          wx.navigateTo({
            url: "../purchase/index?type=Placeanorder"
          })
        }else{
          wx.showModal({
            title: "提示",
            showCancel:false,
            content: "取票人信息不能为空；"
          })
        }

        break;
    };
  },
  onLoad: function () {
    var data_city = wx.getStorageSync('data-city');
    console.log(data_city);
    if (data_city){
      this.setData({
        expressXX: {
          name: data_city.userName,
          onb: data_city.telNumber,
          dz: data_city.provinceName + data_city.cityName + data_city.countyName,
          wz: data_city.detailInfo,
          provinceName: data_city.provinceName,
          cityName: data_city.cityName,
          countyName: data_city.countyName,
        }
      })
    }

    this.setData(app.globalData.order);
    this.setData({
      showpricel: this.data.showprice,
      showpriced: this.data.showprice
    })
    console.log(this.data);
    var pname = "";
    switch (app.globalData.PlatformType){
      case "-1":
        pname = "知亦行"
        break;
      case "1":
        pname = "票牛"
        break;
    }

    wx.getSystemInfo({
      success: function (res) {
        this.setData({
          ptype: pname,
          data: res,
          windowWidth: parseInt(res.windowWidth / 100 * 3)
        })
      }.bind(this)
    })
  },
  bindReplaceInput:function(res){
    ///console.log(res);
    if (!this.data.expressXX.dz){
      this.data.expressXX.dz = "101";
    }
    if (!this.data.expressXX.wz) {
      this.data.expressXX.wz = "100";
    }
    
    switch (res.target.dataset.type){
      case "name":
        this.data.expressXX.name = res.detail.value;
        break;
      case "onb":
        this.data.expressXX.onb = res.detail.value;
        break;
      case "dz":
        this.data.expressXX.dz = res.detail.value;
        this.data.expressXX.wz = "";
        break;
      case "discount":
        //818748
        var discountnumber = res.detail.value;
        if(res.detail.value.length == 6){
          var that = this;
          app.Ajax("GET", {
            title: "加载中",
            url: "https://www.zhanapp.com.cn/openapi/api/v1/promotion_code_verify?code=" + res.detail.value,
            success(res) {
              console.log(res);
              var text = "", color="";
              var discountstate = res.data.results.flag;
              switch(res.data.results.flag){
                case -2:
                  text = "不能使用该分享码（不同的展览分享码使用）"
                  color = "red";
                  break;
                case -1:
                  text = "不存在的优惠码"
                  color = "red";
                  break;
                case 0:
                  text = "优惠码正确"
                  color = "green";
                  console.log(res.data.results.code_info.type);
                  switch (res.data.results.code_info.type) {
                    case 0:
                      var nb = parseFloat(method.jq(that.data.showprice, method.cy(method.cy(that.data.showprice, 0.01), res.data.results.code_info.dt))).toFixed(2);
                      that.setData({
                        showpriced: parseFloat(nb)
                      })
                      break;
                    case 1:
                      var nb = parseFloat(method.jq(that.data.showprice, res.data.results.code_info.dt)).toFixed(2);
                      that.setData({
                        showpriced: parseFloat(nb)
                      })
                      break;
                  }
                  break;
                case 1:
                  text = "已被其他人使用"
                  color = "red";
                  break;
                case 2:
                  text = "已被他人使用, 但未付款，您可以5分钟后再试"
                  color = "red";
                  break;

              }
              that.setData({
                discounttext: text,
                discountcolor: color,
                showprice: that.data.showpriced,
                discountnumber: discountnumber,
                discountstate: discountstate
              })
              
            }
          })
        }else{
          this.setData({
            discounttext: null,
            showprice: this.data.showpricel
          })
        }
        break;
    }
  }
})