var animation_start = false, animation_img = '';
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"https://www.zhanapp.com.cn/php/kapian/",
    cardindex:1,
    animation_name: "",
    alertdata: {
      title: "",
      content: "",
      display: false,
      opentype:"",
      type:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (App.ShareIndexPages()) {
      var info = wx.getStorageSync('zyx_user');
      //获取窗口宽度
      this.setData({
        window: App.globalData.windowdata
      })
      var that = this;
      wx.request({
        url: this.data.url + "?type=getcard&userid=" + info.authData.lc_weapp.openid,
        success: function (res) {
          console.log(res);
          that.setData({
            card: [res.data.card1_count, res.data.card2_count, res.data.card3_count, res.data.card4_count, res.data.card5_count, res.data.card6_count, res.data.card7_count, res.data.card8_count]
          })
        }
      })
    }
  },
  click:function(res){
    var info = wx.getStorageSync('zyx_user');

    var that = this;
    switch (res.currentTarget.dataset.type){
      case 'image':
        animation_img = res.currentTarget.dataset.id;
        if (that.data.cardindex != res.currentTarget.dataset.id && !animation_start){
          animation_start = true;
          that.setData({
            //animation_name: "animation-name:openxz;animation-duration: .5s;",
            cardindex: animation_img
          })
          animation_start = false;
          /*setTimeout(function () {
            that.setData({
              cardindex: animation_img
            })
            setTimeout(function () {
              that.setData({
                animation_name: ""
              })
              animation_start = false;
            }, 300)
          }, 250)
          */
        }

      break;
      case 'rule':
        wx.navigateTo({
          url: "./rule/index"
        })
      break;
      case 'close':

        this.setData({
          alertdata: {
            title: "",
            content: "",
            display: false,
            opentype: "",
            type: ''
          }
        })

      break;
      case "nogive":
        wx.showModal({
          title: '提示',
          content: '您的卡片必须大于等于2张以上，才可以送给好友！',
          showCancel: false
        })
      break;
      case "give":
        wx.showLoading({
          title: "加载中",
          mask:true
        })
        wx.request({
          url: this.data.url + "index.php?userid=" + info.authData.lc_weapp.openid + "&type=give&nickname=" + encodeURI('[[[[[||||' + App.encode64(info.nickname)) + "&cardid=" + this.data.cardindex,
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            if(res.data.code == 0){

                that.setData({
                  Indexesid: res.data.data.Indexesid,
                  alertdata: {
                    title: "提示",
                    content: res.data.msg,
                    display: true,
                    opentype: "share",
                    type:'give'
                  }
                })

            }
          }
        })
      break;
      case "obtain":
        wx.showLoading({
          title: "生成中",
          mask: true
        })
        wx.request({
          url: this.data.url + "index.php?userid=" + info.authData.lc_weapp.openid + "&type=obtain&nickname=" + encodeURI('[[[[[||||' + App.encode64(info.nickname)) + "&cardid=" + this.data.cardindex,
          success: function (res) {
            wx.downloadFile({
              url: this.data.url + "getimg.php?bgcolor=3a4050&name=" + encodeURI(info.nickname) + "&cardid=" + this.data.cardindex +"&page=pages/Games/fragment/obtain/index&scene=" + res.data.data.Indexesid,
              success: function (res) {
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

          }.bind(this)
        })


      break;
      case "exchange":
        wx.navigateTo({
          url: "./exchange/index"
        })
      break;
    }
  },
  onShareAppMessage: function (res) {
    console.log(res)
    //资源文件刷新
    var title, img, path;
    var nbs = parseInt(Math.random() * 4);
    title = '我有一张卡片送给你，聚齐可兑换的展览门票，快来领取吧！';
    img = this.data.url + "images/" + this.data.cardindex + ".png";
    if (res.target.dataset.type == "give"){
      path = '/pages/Games/fragment/give/index?scene=' + this.data.Indexesid;
    }else{
      path = '/pages/Games/fragment/';
    }

    this.setData({
      alertdata: {
        title: "",
        content: "",
        display: false,
        opentype: "",
        type:''
      }
    })
    
    return {
      title: title,
      path: path,
      imageUrl: img,
      success: function () {
        wx.showModal({
          title: '提示',
          content: '分享成功！',
          showCancel: false
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '赠送失败',
          content: '您可能取消了赠送',
          showCancel: false
        })
      }
    }


  }
})