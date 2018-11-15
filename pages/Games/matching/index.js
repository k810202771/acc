var audio = wx.createInnerAudioContext();
var App = getApp();
var timer=[0,0,0,0], MatchToTime;

Page({
  data:{
    lookingTF:"block",
    animationData:'',
    animatleft:-100,
    animatright:100,
    leftUserP:-100,
    rightUserP:100,
    vsScale:1,
    VSopacity:0,
    level:0,
  },
  onLoad:function(options){
    //资源文件刷新（写这个后面）
    var imgs = wx.getStorageSync('resources');
    
    audio.src = App.getIcon('刀切声音', imgs);
    this.setData({
      imgs: {
        LookingFor: App.getIcon('旋转的地球', imgs),
        VSicon: App.getIcon('vsIcon', imgs)
      }
    })
    //设置用户自己的头像，匹配到人的头像在下面设置！
    var info = wx.getStorageSync('zyx_user');
    console.log(info);
    this.setData({
      info: info,
      level: options.level,
      UserImg: info.headimgurl,
      UserText: info.nickname + "\n" + App.getChina(info.city),
    })

    //this.MatchTo(AIData[parseInt(Math.random() * AIData.length)]);
  },
  /* 收到数据 */
  onMessage: function (res){
    console.log('返回' + res.data)
  },
  onShow:function(){
      App.GameData.GaneMatching = this;

      //终止计时器
      for (var i = 0; i < timer.length;i++){
        clearTimeout(timer[i]);
      }
  
      wx.sendSocketMessage({
        data: '{ "action":"login","sessiontoken":"'+ this.data.info.sessiontoken +'"}',
        success:function(res){
          console.log(res)
        }
      })
      
      /* 创建房间 */
      /*wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/challege_match",
        data: "sessiontoken=" + this.data.info.sessiontoken + "&level=" + this.data.level,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(res);
        }.bind(this)
      })*/


        wx.request({
          url: "https://www.zhanapp.com.cn/api/v1/wxapp/challenge",
          data: "sessiontoken=" + this.data.info.sessiontoken + "&level=" + this.data.level,
          method: "POST",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (res) {
            console.log(res);

            switch (res.data.status){
              case 0:
                wx.showModal({
                  title: '提示',
                  showCancel:false,
                  content: res.data.error.message,
                  success:function(res){
                    if(res.confirm){
                      wx.navigateBack()
                    };
                  }
                })
              break;
              default:
                //更新数据
                var info = wx.getStorageSync('zyx_user');
                info.current_power = res.data.results.user.current_power
                info.points = res.data.results.user.points
                wx.setStorageSync('zyx_user', info)
                
                console.log(wx.getStorageSync('zyx_user'));
                //匹配AI时间随机
                clearTimeout(MatchToTime);
                MatchToTime = setTimeout(function () {
                  var str = res.data.results.matcher.icon
                  res.data.results.matcher.icon = str.replace("/0", "/132");
                  App.questionData(res.data.results.questionData);
                  App.GameData.challengeId = res.data.results.challengeId;
                  this.setData({
                    base64IMG: res.data.results.matcher.icon,
                    questionData: res.data.results.questionData,
                    matcher: res.data.results.matcher
                  })
                }.bind(this), parseInt(Math.random() * 0 + 500))
              break;
            }
          }.bind(this)
        })
        


      /* 自定义动画地球旋转 */
      this.setData({
        animationData: 'k-loadingO 10s linear infinite'
      })
  },
  imgerror:function(){
    var numberValue = (parseInt(Math.random() * 1508) + 1);

    this.data.matcher.icon = "https://www.zhanapp.com.cn/img/UserImg/" + numberValue + ".jpg";
    this.setData({
      matcher: this.data.matcher
    })
    this.MatchTo(this.data.matcher);
    //停止地球循环播放动画
    clearTimeout(timer[0]);
  },
  imgload:function(e){
    if(e.detail.height == 120 || e.detail.width == 120){
      var numberValue = (parseInt(Math.random() * 1508) + 1);

      this.data.matcher.icon = "https://www.zhanapp.com.cn/img/UserImg/" + numberValue+".jpg";
      this.setData({
        matcher: this.data.matcher
      })
      this.MatchTo(this.data.matcher);
    }else{
      this.MatchTo(this.data.matcher);
    };
    //停止地球循环播放动画
    clearTimeout(timer[0]);
    
  },
  //匹配到人之后执行的回调,data为匹配到人的信息
  MatchTo:function(data){
    this.setData({
      animationData: 'k-loading1 500ms ease-in 1'
    })
    timer[1] = setTimeout(function () {
      if (App.GameData.sound)audio.play();
      this.setData({
        lookingTF: "none",
        User2Img:data.icon,
        animatleft: 0,
        animatright: 0
      })
      //页面进入后播放动画
      timer[2] = setTimeout(function () {
        this.setData({
          leftUserP: 0,
          rightUserP: 0,
          VSopacity: 1,
          UserText2: data.name + "\n" + App.getChina(data.city),
          vsScale:0.3
        })

        //展示2秒后跳转到答题页面
        timer[3] = setTimeout(function () {
          wx.redirectTo({
            url: '../Answer/index?User={"u1":{"img":"' + this.data.UserImg + '","name":"' + this.data.UserText.substring(0, this.data.UserText.indexOf("\n")) + '"}, "u2":{"img":"' + this.data.User2Img + '","name":"' + this.data.UserText2.substring(0, this.data.UserText2.indexOf("\n")) + '"} }&level=' + this.data.level
          })
          App.GameData.state = true;
        }.bind(this), 1500) //动画播放完成后等待1s

      }.bind(this), 500) //动画时间

    }.bind(this), 500)
  },
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    for (var i = 0; i < timer.length; i++) {
      clearTimeout(timer[i]);
      clearInterval(timer[i]);
    }
    clearTimeout(MatchToTime);
  }
})