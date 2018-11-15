App = getApp();
var User, ontime, yici,kstime,extime,onShowEx;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    User: {
      //vn连胜的次数 pn连续答对几题
      u1: {
        img: "",
        name: "",
        vn: 0,
        pn: 0,
        pnLeft: "",
        score: 0, click: false, select: 0,
        expression:[]
      },
      u2: {
        img: "",
        name: "",
        vn: 2,
        pn: 5,
        pnLeft: "",
        score: 0, click: false, select: 0,
        level: 15,
        expression:[]
      }
    },
    kp1: {
      display: "none",
      img:"",
      left: 0,
      top: 0,
      s: 1
    },
    kp2: {
      display: "none",
      img: "",
      left: 0,
      top: 0,
      s: 1
    },
    bgdisplay:"none",
    bgopacity:0.5,
    fopacity: 1,
    scoreTop: null,
    UserVpnTop:null,
    TFIconHeight:null,
    rewardTop:0
  },
  //更新数据
  DataUpdate: function (name, data) {
    this.setData({
      [name]: data
    })
  },
  faexpression:function(){
    setTimeout(function () {
      var u2ExpressionIcon = this.data.ExpressionIcon[parseInt(Math.random() * 10)];
      for (var p = 0; p < (yici ? 1 : parseInt(Math.random() * 6) + 3); p++) {
        setTimeout(function () {
          User.u2.expression.push({ opacity: 1, left: 0, top: parseInt(Math.random() * 140), src: u2ExpressionIcon, display: 'block', });
          this.DataUpdate("User", User);
          User.u2.expression[User.u2.expression.length - 1].left = parseInt(Math.random() * 100);
          this.DataUpdate("User", User);

          //渐隐
          setTimeout(function () {
            for (var i = 0; i < User.u2.expression.length; i++) {
              if (User.u2.expression[i].opacity != 0) {
                User.u2.expression[i].opacity = 0;
                break;
              };
            }
            this.DataUpdate("User", User);
          }.bind(this), 1500)

          //隐藏
          setTimeout(function () {
            for (var i = 0; i < User.u2.expression.length; i++) {
              if (User.u2.expression[i].display != false) {
                User.u2.expression[i].display = false;
                if (i == User.u2.expression.length) {
                  User.u2.expression = [];
                }
                break;
              };
            }
            this.DataUpdate("User", User);
          }.bind(this), 2000)
        }.bind(this), parseInt(Math.random() * 500) + p * 200)
      }
    }.bind(this), parseInt(Math.random() * 500) + 200)
  },
  onHide: function () {
    clearInterval(extime);
  },
  //按下表情后触发
  onExpression:function(e){
    //资源文件刷新
    var mp3s = wx.getStorageSync('resources');

    var audio = new wx.createInnerAudioContext();
    audio.volume = 0.8;
    audio.src = App.getIcon('表情声音', mp3s);

    audio.stop();
    audio.seek(0);
    if (App.GameData.sound) audio.play();

    yici = true;

    //记录时间
    var Xtime = new Date().getTime();

    if (Xtime - ontime < 500) {
      yici = false;
    }

    if (!ontime && Xtime - kstime < 20 * 1000 || Xtime - ontime > 2000 && parseInt(Math.random() * 2) == 1 && Xtime - kstime < 20 * 1000) {
      /* 执行代码 */
      if (parseInt(Math.random() * 2) == 1){
        this.faexpression();
      }
      /* 执行代码 */
      ontime = new Date().getTime()
    };

    if (!ontime || Xtime - ontime < 1000){
      ontime = new Date().getTime()
    }
    //U1创建表情
    User = this.data.User;
    User.u1.expression.push({ opacity:1, left: 0, top: parseInt(Math.random() * 140), src: this.data.ExpressionIcon[e.currentTarget.dataset.index], display:true,});

    this.DataUpdate("User", User);
    User.u1.expression[User.u1.expression.length - 1].left = parseInt(Math.random() * 100);
    this.DataUpdate("User", User);

    //渐隐
    setTimeout(function () {
      for (var i = 0; i < User.u1.expression.length; i++) {
        if (User.u1.expression[i].opacity != 0) {
          User.u1.expression[i].opacity = 0;
          break;
        };
      }
      this.DataUpdate("User", User);
    }.bind(this), 1500)
    //隐藏
    setTimeout(function () {
      for (var i = 0;i < User.u1.expression.length;i++){
        if (User.u1.expression[i].display != false){
          User.u1.expression[i].display = false;
          if (i == User.u1.expression.length){
            User.u1.expression = [];
          }
          break;
        };
      }
      this.DataUpdate("User", User);
    }.bind(this), 2000)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*setTimeout(function(){
      this.setData({
        kp1:{
          display: "block",
          img:"",
          left: -20,
          top: 0,
          s:1
        },
        kp2: {
          display: "block",
          img: "",
          left: 20,
          top: 0,
          s: 1
        }
      })
      setTimeout(function () {
        this.setData({
          kp1: {
            display: "block",
            left: -40,
            top: -40,
            s: 0
          }
        })
        setTimeout(function () {
          this.setData({
            kp2: {
              display: "block",
              left: -40,
              top: -40,
              s: 0
            }
          })
        }.bind(this), 100)
      }.bind(this), 2000)
    }.bind(this),2000)*/

    var imgs = wx.getStorageSync('resources');
    //设置用户自己的头像，匹配到人的头像在下面设置！
    var info = wx.getStorageSync('zyx_user');
    kstime = new Date().getTime();
    //是否显示表情
    onShowEx = (parseInt(Math.random()*2) == 1?true:false);

    User = JSON.parse(options.User);
    User.u1.expression = [];
    User.u2.expression = [];
    //刷新data数据
    this.DataUpdate("User", User);

    console.log(User.u1.score , User.u2.score)
    this.setData({
      info: info,
      ExpressionIcon: [
        App.getIcon('表情1', imgs),
        App.getIcon('表情2', imgs),
        App.getIcon('表情3', imgs),
        App.getIcon('表情4', imgs),
        App.getIcon('表情5', imgs),
        App.getIcon('表情6', imgs),
        App.getIcon('表情7', imgs),
        App.getIcon('表情8', imgs),
        App.getIcon('表情9', imgs),
        App.getIcon('表情10', imgs)
      ],
      imgs: {
        bgg: App.getIcon('光芒', imgs),
        btitle: App.getIcon('恭喜获得一张卡', imgs),
        ExpressionBg: App.getIcon('表情背景', imgs),
        TFIcon: (User.u1.score > User.u2.score ? App.getIcon('胜利奖杯', imgs) : User.u1.score < User.u2.score ? App.getIcon('平局奖杯', imgs) : App.getIcon('失败奖杯', imgs)),
        integral: App.getIcon('integral', imgs)
      }
    })

    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.UserIcon').boundingClientRect()
    query.exec(function (res) {
      console.log(res)
      this.setData({
        TFIconHeight: res[0].width + 50,
        scoreTop: res[0].width + res[0].top + 20,
        UserVpnTop: res[0].width + res[0].top + 100,
        rewardTop: res[0].width + res[0].top + 100
      })
    }.bind(this))
    
    console.log("https://www.zhanapp.com.cn/api/v1/wxapp/challenge/results"+"sessiontoken=" + this.data.info.sessiontoken + "&challengeId=" + App.GameData.challengeId + "&results=" + (User.u1.score > User.u2.score ? 1 : User.u1.score == User.u2.score ? 2 : 0) + "&begoodat=" + App.GameData.types.join(','));
    /*POST上传结果*/
    wx.request({
      url: "https://www.zhanapp.com.cn/api/v1/wxapp/challenge/results",
      data: "sessiontoken=" + this.data.info.sessiontoken + "&challengeId=" + App.GameData.challengeId + "&results=" + (User.u1.score > User.u2.score ? 1 : User.u1.score == User.u2.score ? 2 : 0) + "&begoodat=" + App.GameData.types.join(','),
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        console.log(res);

        if (res.data.results.bounds.code) {
          this.setData({
            card: { id: res.data.results.bounds.cardid, display: true, width: App.globalData.windowdata.screenWidth, pixelRatio: App.globalData.windowdata.pixelRatio }
          })
        }
        //显示卡片，暂时屏蔽
        /*
        this.setData({
          kp1: {
            display: "block",
            img: res.data.results.card.img,
            left: 0,
            top: 0,
            s: 1
          }
        })*/
        //奖励内容
        this.setData({
          boundsPoints:res.data.results.boundsPoints
        })

      }.bind(this)
    })
    App.GameData.state = false;

  },
  ontiaog:function(){
    this.setData({
      bgdisplay: "none"
    })
  },
  onShow:function(){
    clearInterval(extime);
    extime = setInterval(function () {
      //记录时间
      var Xtime = new Date().getTime();

      if (Xtime - kstime < 20 * 1000 && onShowEx) {
        if (parseInt(Math.random() * 2) == 1) {
          yici = true;
        } else {
          yici = false;
        };
        if (parseInt(Math.random() * 5) == 1) {
          this.faexpression();
        }
      } else if (Xtime - kstime > 20 * 1000) {
        clearInterval(extime);
      }

    }.bind(this), 1000)
  },
  Bank:function(){
    wx.navigateBack()
  },
  onShareAppMessage: function (res) {
    console.log(res);
    //资源文件刷新
    var imgs = wx.getStorageSync('resources');
    console.log();
    switch (res.target.dataset.type){
      case "kp":
        var ashare = {
          title: '我正在收集卡片兑换免费展览门票，你也来试试吧！',
          imageUrl: App.getIcon('分享图5', imgs)
        }
      break;
      default:
        var ashare = {
          title: '五道题我得了' + User.u1.score + '分，是不是很厉害？',
          imageUrl: App.getIcon('分享图2', imgs)
        }
      break;
    }

    return {
      title: ashare.title,
      path: '/pages/Games/index',
      imageUrl: ashare.imageUrl,
      success: function (res) {
        if(res.target.dataset.type == 'kp'){
          wx.request({
            url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=share_ticket",
            data: "sessiontoken=" + this.data.info.sessiontoken + "&challengeId=" + App.GameData.challengeId,
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            success: function (res) {
              console.log(res);

              this.setData({
                fopacity: 0,
                kp1: {
                  display: "block",
                  img: this.data.kp1.img,
                  left: -20,
                  top: 0,
                  s: 1
                },
                kp2: {
                  display: "block",
                  img: res.data.results.card.img,
                  left: 20,
                  top: 0,
                  s: 1
                }
              })

              setTimeout(function () {
                this.setData({
                  bgopacity: 0,
                  kp1: {
                    display: "block",
                    img: this.data.kp1.img,
                    left: -40,
                    top: -40,
                    s: 0
                  }
                })
                setTimeout(function () {
                  this.setData({
                    kp2: {
                      display: "block",
                      img: this.data.kp2.img,
                      left: -40,
                      top: -40,
                      s: 0
                    }
                  })
                  setTimeout(function () {
                    this.setData({
                      bgdisplay: "none"
                    })
                  }.bind(this), 1000)
                }.bind(this), 100)
              }.bind(this), 1000)
            }.bind(this)
          })
        }

        wx.request({
          url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=share",
          data: "sessiontoken=" + this.data.info.sessiontoken,
          method: "POST",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (res) {
            if (res.data.results.isBounds == 1) {
              wx.showModal({
                title: '分享成功',
                content: '体力 +' + res.data.results.bounds_power_points,
                showCancel: false
              })
            } else {
              /*wx.showModal({
                title: '分享成功',
                content: '分享成功！',
                showCancel: false
              })*/
            };
          }
        })
      }.bind(this),
      fail: function (res) {
        wx.showModal({
          title: '分享失败',
          content: '您可能取消了分享',
          showCancel: false
        })
      }
    }
  },
  click: function (res) {
    switch (res.currentTarget.dataset.type) {
      case "card_close":
        this.setData({
          card: { id: 1, display: false, width: App.globalData.windowdata.screenWidth, pixelRatio: App.globalData.windowdata.pixelRatio }
        })
        break;
      case "card_jump":
        wx.redirectTo({
          url: "/pages/Games/fragment/index"
        })
        break;
    }
  }
})