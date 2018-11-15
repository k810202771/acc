// pages/Activepage/help/index.js
var App = getApp();
var openurl = "https://www.zhanapp.com.cn/php/zhanapp-php";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{
      head:"",
      name:""
    },
    timer:{
      H:"00",
      m: "00",
      s: "00"
    },
    Qtime:0,
    Mors:false
  },
  //計算積分
  getzjf:function(data){
    var zjf = 0;
    for (var i = 0; i < data.length;i++){
      zjf = zjf + parseFloat(data[i].integral) + parseFloat(data[i].additional);
    }
    return zjf;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  updata(data){
    var info = wx.getStorageSync('zyx_user');
    this.setData({
      user: {
        head: data.data.users[0].wximg,
        name: data.data.users[0].wxname
      },
      zjf: this.getzjf(data.data.users),
      userdata: data.data.users,
      Mors: data.data.openid == info.objectId ? true : false,
      scene: data.data.par_id
    })
    if(!this.data.Mors){
      App.aldstat.sendEvent('从分享进入帮助好友助力！');
    }
    this.update(data.data.endtime);
  },
  onLoad: function (options) {
    if (App.ShareIndexPages()) {
      var info = wx.getStorageSync('zyx_user');
      var that = this;
      switch (options.scene){
        case "false":
          let data = JSON.parse(options.data);
          this.updata(data);
          break;
        default:
          App.Ajax("GET", {
            title: "加载中…",
            url: openurl + "/partition/partition.php?parid=" + options.scene + "&openid=" + info.objectId + "&img=" + info.headimgurl + "&wxname=" + App.filter(info.nickname),
            success(res) {
              console.log(res)
              if(res.data.code == 1){
                wx.showModal({
                  title:"提示",
                  content: res.data.msg,
                  showCancel:false
                })
              }
              that.updata(res.data);
            }
          })
          break;
      }

    }
  },
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    clearTimeout(this.data.Qtime);
  },
  update(timer) {
    var time = new Date().getTime() + 60 * 60 * 1000 * 8;
    if(time > parseInt(timer) * 1000){
      this.setData({
        timer: {
          H: "00",
          m: "00",
          s: "00"
        }
      })
    }else{
      var time = new Date(parseInt(timer) * 1000 - time);
      this.data.Qtime = setTimeout(function () {
        this.setData({
          timer: {
            H: App.format("H", time),
            m: App.format("m", time),
            s: App.format("s", time)
          }
        })
        this.update(timer);
      }.bind(this), 1000)
    }

  },
  onShareAppMessage: function () {
    return {
      title: "积分抵现啦，快来领取吧！",
      path: '/pages/Activepage/help/index?scene=' + this.data.scene,
      imageUrl: "https://static.zhanapp.com.cn/downloadFile/boxfx.jpg"
    }
  },
  click(res){
    switch(res.currentTarget.dataset.type){
      case "pyq":
        wx.showLoading({
          title: "下载中",
          mask: true
        })
        wx.downloadFile({
          url: openurl + "/partition/getimg.php?scene=" + this.data.scene + "&wxname=" + this.data.user.name + "&wximg=" + this.data.user.head,
          success: function (res) {
            wx.hideLoading();
            wx.showLoading({
              title: "保存中",
              mask: true
            })
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                wx.showModal({
                  title: '保存成功',
                  content: '图片已经保存到相册，可以分享到朋友圈了',
                  showCancel: false
                })
              },
              fail: function (res) {
                wx.openSetting()
              },
              complete: function () {
                wx.hideLoading();
              }
            })
          }
        })
        break;
      case "box":
        wx.redirectTo({
          url:"../openbox/index"
        })
        break;
      case "en":
        var url = '/pages/main_page/zhanxun/index' + '?scene=5b4708a7128fe1005b04fe17'
        wx.navigateTo({
          url: url
        })
        break;
    }
  }
})