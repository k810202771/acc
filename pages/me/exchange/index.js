var util = require('../../../utils/util.js')

var App = getApp();
var yf = new Date();
var yfdata = { 
  by: new Date(yf.getTime()), 
  sy: new Date(yf.setMonth(yf.getMonth() - 1)),
  ssy: new Date(yf.setMonth(yf.getMonth() - 1))
  }
  function shuang(str){
    if(str < 10){
      return "0" + str;
    }
    return str;
  }
// pages/me/exchange/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: "https://www.zhanapp.com.cn/php/kapian/",
    index: 1,
    data:[],
    by: { n: yfdata.by.getFullYear(), y: shuang(yfdata.by.getMonth() + 1)},
    sy: { n: yfdata.sy.getFullYear(), y: shuang(yfdata.sy.getMonth() + 1) },
    ssy: { n: yfdata.ssy.getFullYear(), y: shuang(yfdata.ssy.getMonth() + 1) },
    yindex: yfdata.by.getFullYear() + "" + shuang(yfdata.by.getMonth() + 1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      window: App.globalData.windowdata
    })
    this.update(true);
  },
  update:function(reset){
    if (reset){
      this.data.index = 1;
      this.data.data = [];
    }
    var info = wx.getStorageSync('zyx_user');
    console.log(this.data.url + "userlist.php?openid=" + info.authData.lc_weapp.openid + "&tbltime=" + this.data.yindex + "&pageindex=" + this.data.index);
    App.Ajax("GET", {
      title: "加载中",
      url: this.data.url + "userlist.php?openid=" + info.authData.lc_weapp.openid + "&tbltime=" + this.data.yindex + "&pageindex=" + this.data.index,
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          this.data.data.push(res.data[i]);
        }
        console.log(res);
        if (res.data.length) this.data.index++;

        console.log(this.data.data);
        this.setData({
          data: this.data.data
        })
      }.bind(this)
    })
  },
  onReachBottom: function () {
    this.update();
  },
  click:function(res){
    this.setData({
      yindex: res.currentTarget.dataset.time
    })
    this.update(true);
  },
  clickto:function(res){
    var cnumber = res.currentTarget.dataset.cnumber;
    App.Ajax("GET", {
      title: "加载中",
      url: 'https://www.zhanapp.com.cn/php/urlget.php?url=https://sp0.baidu.com/9_Q4sjW91Qh3otqbppnN2DJv/pae/channel/data/asyncqury?cb=jQuery11020700626140914993_1529638439995&appid=4001&com=zhongtong&nu=' + cnumber +'&vcode=&token=&_=1529638440004',
      success: function (res) {
        var str = res.data.substring('/**/jQuery11020700626140914993_1529638439995('.length);
        str = str.substring(0, str.length - 1);
        console.log(JSON.parse(str));
        var wuliu = JSON.parse(str).data.info.context;
        var wuliuname = JSON.parse(str).data.company;
        for (var i = 0; i < wuliu.length;i++){
          wuliu[i].time = util.formatTime(new Date(parseInt(wuliu[i].time + "000")))
        }
        console.log(wuliu)
        this.setData({
          wuliuid: cnumber,
          wuliu: wuliu,
          wuliuname: wuliuname
        })
        
      }.bind(this)
    })
    
  }

})