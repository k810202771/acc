// pages/Activepage/openbox/index.js
var App = getApp();
var openurl = "https://www.zhanapp.com.cn/php/zhanapp-php"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:"https://static.zhanapp.com.cn/downloadFile/closebx.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    if (App.ShareIndexPages()) {
      var info = wx.getStorageSync('zyx_user');
      App.Ajax("GET", {
        title: "加载中…",
        url: openurl + "/partition/partition.php?openid=" + info.objectId + "&date=" + App.format("YMd", new Date()),
        success(res) {
          console.log(res)
          if(res.data.code == 1){
            wx.redirectTo({
              url: "../help/index?scene=false&data=" + JSON.stringify(res.data)
            })
          }else{
            App.aldstat.sendEvent('进入抽奖页面');
          }

        }
      })
    }
  },
  click(res){
    var info = wx.getStorageSync('zyx_user');
    console.log(info);
    var that = this;
    console.log(openurl + "/partition/partition.php?openid=" + info.objectId + "&img=" + info.headimgurl + "&wxname=" + App.filter(info.nickname));

    switch (res.currentTarget.dataset.type){
      case "box":
        App.Ajax("GET",{
          title:"开启中…",
          url: openurl + "/partition/partition.php?openid=" + info.objectId + "&img=" + info.headimgurl + "&wxname=" + App.filter(info.nickname),
          success(res){
            console.log(res)
            if(res.data.code == 1){
              that.setData({
                img:"https://static.zhanapp.com.cn/downloadFile/openbx.png"
              })
              setTimeout(function(){
                wx.redirectTo({
                  url: "../help/index?scene=false&data=" + JSON.stringify(res.data)
                })
              },2000)
            }
          }
        })
        break;
      case "en":
        var url = '/pages/main_page/zhanxun/index' + '?scene=5b4708a7128fe1005b04fe17'
        wx.navigateTo({
          url: url
        })
        break;
    }
    //
  }
})