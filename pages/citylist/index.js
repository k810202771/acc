var App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    img:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  click:function(res){
    wx.setStorageSync('city', res.currentTarget.dataset.name);
    this.setData({
      city: res.currentTarget.dataset.name
    })
    wx.navigateBack()
  },
  onLoad: function (options) {
    this.setData({
      img:{
        width: parseInt(App.globalData.windowdata.windowWidth * 0.145),
        height: parseInt(App.globalData.windowdata.windowWidth * 0.145)
      }
    })
    var city = wx.getStorageSync('city');
    this.setData({
      city:city
    })
    console.log(App.globalData.url + "/Api/v1/" + "city");
    wx.request({
      url: encodeURI(App.globalData.url + "/Api/v1/" + "city"),
      method: "GET",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        console.log(res)
        var data = res.data.results;
        for (var i = 0; i < data.length;i++){

          for (var key in data[i]) {

            this.data.list.push({ name: key, number: data[i][key], img: this.getImage(key)})

          }

        }
        this.setData({
          list:this.data.list
        })
      }.bind(this)
    })
    
  },
  getImage:function(city){
    var list = [
      { name: "北京", url:"icon-beijing"},
      { name: "上海", url: "icon-shanghai" },
      { name: "深圳", url: "icon-shenzhen" },
      { name: "广州", url: "icon-guangzhou" },
      { name: "天津", url: "icon-tianjin" },
      { name: "成都", url: "icon-chengdu" },
      { name: "杭州", url: "icon-hanzhou" },
      { name: "南京", url: "icon-nanjing" },
      { name: "苏州", url: "icon-shuzhou" },
      { name: "武汉", url: "icon-wuhan" },
      { name: "西安", url: "icon-cityxian" },
      { name: "其它", url: "icon-qita" },
    ]
    for(var e=0;e<list.length;e++){
      if(list[e].name == city){
        return list[e].url;
      }
    }
  }
})