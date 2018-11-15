var App = getApp();
var img = [];
function StarMax(a,t) {
  var array = [];
  for (var i = 1; i <= t; i++) {
    array.push({jb:a, dj:i});
  }
  return array;
}
var level = [
  { icon: "", name: "青铜", level: StarMax(0, 1), text:'Ⅰ'},
  { icon: "", name: "青铜", level: StarMax(1, 2), text:'Ⅱ'},
  { icon: "", name: "青铜", level: StarMax(2, 3), text: 'Ⅲ'},
  { icon: "", name: "白银", level: StarMax(3, 3), text: 'Ⅰ' },
  { icon: "", name: "白银", level: StarMax(4, 3), text: 'Ⅱ' },
  { icon: "", name: "白银", level: StarMax(5, 3), text: 'Ⅲ' },
  { icon: "", name: "黄金", level: StarMax(6, 4), text: 'Ⅰ' },
  { icon: "", name: "黄金", level: StarMax(7, 4), text: 'Ⅱ' },
  { icon: "", name: "黄金", level: StarMax(8, 4), text: 'Ⅲ' },
  { icon: "", name: "白金", level: StarMax(9, 5), text: 'Ⅰ' },
  { icon: "", name: "白金", level: StarMax(10, 5), text: 'Ⅱ' },
  { icon: "", name: "白金", level: StarMax(11, 5), text: 'Ⅲ' },
  { icon: "", name: "钻石", level: StarMax(12, 5), text: 'Ⅰ' },
  { icon: "", name: "钻石", level: StarMax(13, 5), text: 'Ⅱ' },
  { icon: "", name: "钻石", level: StarMax(14, 5), text: 'Ⅲ' },
  { icon: "", name: "王者联赛", level: StarMax(15, 1), text: ''}
]
var levelStars = 1, Starlevel = 0;
Page({
  data:{
    headimgurl:null,
    nameText:null,
    //Ranking: 'https://www.zhanapp.com.cn/img/01/ranking.png', //排行榜
    GameData:{
      Grade:0,
      data:[]
      },
    scrollTop: 0,
    image:[],
    EXdisplay: false

  },
  ///回复体力
  Porint: function () {
    var info = wx.getStorageSync('zyx_user');
    //(this.data.info.max_power - this.data.info.current_power)
    console.log(this.data.hp);
    if (this.data.hp > 0) {
      wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=exchange",
        data: "sessiontoken=" + this.data.info.sessiontoken + "&power_point=" + this.data.hp,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          info.current_power = res.data.results.current_power
          info.points = res.data.results.points
          wx.setStorageSync('zyx_user', info)

          this.setData({
            info: info
          })

          var pointMax = parseInt(this.data.info.points / 1)
          var hp = (this.data.info.max_power - this.data.info.current_power);

          wx.showModal({
            title: '提示',
            content: '体力 +' + this.data.hp,
            showCancel: false
          })

          this.setData({
            EXdisplay: false,
            hp: (pointMax <= hp ? pointMax : hp)
          })
        }.bind(this)
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '体力已满。',
        showCancel: false
      })
    }
  },
  onShow:function(){
    var info = wx.getStorageSync('zyx_user');

    if(App.GameData.state){
      /*POST上传结果*/
      wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/challenge/results",
        data: "sessiontoken=" + this.data.info.sessiontoken + "&challengeId=" + App.GameData.challengeId + "&results= 0&begoodat=" + App.GameData.types.join(','),
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(res);
        }
      })
      App.GameData.state = false;
    }

    console.log(info);
    levelStars = info.level;
    Starlevel = info.current_start;
    this.refresh();
    //更新用户积分体力值数据
    wx.request({
      url: "https://www.zhanapp.com.cn/api/v1/wxapp/user/status?sessiontoken=" + info.sessiontoken,
      method: "GET",
      header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      success: function (res) {
        info.current_power = res.data.results.current_power
        info.points = res.data.results.points
        info.level = res.data.results.level
        info.current_start = res.data.results.current_start
        //更新数据
        App.GameData.level = res.data.results.level
        App.GameData.current_start = res.data.results.current_start
        //levelStars = App.GameData.level;
        //Starlevel = App.GameData.current_start;
        console.log(res);
        wx.setStorageSync('zyx_user', info)
        //刷新
        console.log(levelStars, Starlevel)
        this.refresh(App.GameData.level, App.GameData.current_start)
      }.bind(this)
    })


    this.setData({
      info: info,
      Gamesound: App.GameData.sound,
    })
  },
  //隐藏显示兑换体力window
  EXSHOW:function (a) {
    var pointMax = parseInt(this.data.info.points / 1)
    var hp = (this.data.info.max_power - this.data.info.current_power);
    this.setData({
      hp: (pointMax <= hp ? pointMax : hp),
      EXdisplay: (a.currentTarget.dataset.buer == 0 ? true : false)
    })
  },
  ranking:function(){
    wx.navigateTo({
      url: '../Ranking/index'
    })
  },
  onclick:function () {
    wx.navigateTo({
      url: "../rule/index"
    })
  },
  onLoad:function(opdata){
    //资源文件刷新（写这个后面）
    var imgs = wx.getStorageSync('resources');
    for (var i = 0; i < level.length;i++){
      level[i].icon = App.getIcon(level[i].name+"_m", imgs);
    }
    this.setData({
      imgs:{
        wzxx: App.getIcon('王者星星', imgs),//头部背景
        bsxx: App.getIcon('白色星星', imgs),//头部背景
        chsxx: App.getIcon('黑色星星', imgs),//头部背景
        hsxx: App.getIcon('黄色星星', imgs),//头部背景
        header_bg: App.getIcon('header_bg', imgs),//头部背景
        lightning: App.getIcon("lightning", imgs), //闪电
        integral: App.getIcon('integral', imgs),//积分图标
        jiahao: App.getIcon('jiahao', imgs),//加号图标
        lockImg: App.getIcon("锁子", imgs)
      }
    })
    //刷新
    this.refresh()
  },
  //刷新数据
  refresh:function(a,b){
    var info = wx.getStorageSync('zyx_user');

    if (a > levelStars || b > Starlevel){
      this.setData({
        play: true
      })
    }else{
      this.setData({
        play: false
      })
    }
    levelStars = info.level;
    Starlevel = info.current_start;

    //生成可显示数据
    var levelData = [];
    for (var i = 0; i < level.length; i++) {
      if (i == levelStars) {
        level[i].length = i
        levelData.push(level[i])
        break;
      } else {
        levelData.push(level[i])
      }
    }

    console.log(this.data.play);

    //更新数据
    this.setData({
      info: info,
      headimgurl: info.headimgurl,
      GameData: {
        Grade: levelStars,
        data: levelData,
        Starlevel: Starlevel
      },
      nameText: info.nickname
    })
    //更新数据
    if (App.GameData.scrollButtom == true){
      setTimeout(function () {
        this.setData({
          scrollTop: 'p_Unlocked',
        })
      }.bind(this), 500)
      App.GameData.scrollButtom = false;
    }
  },
  //跳转到匹配
  matching: function(e){
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == "none") {
          wx.showToast({
            title: "请检查您的网络！",
            icon: "none",
            duration: 3000
          })
        }else{

          switch (e.currentTarget.id) {
            case "Unlocked":
              wx.navigateTo({
                url: "../matching/index?level=" + (e.currentTarget.dataset.uid + 1)
              })
              break;
            case "p_Unlocked":
              wx.navigateTo({
                url: "../matching/index?level=" + (e.currentTarget.dataset.uid + 1)
              })
              break;
            case "noUnlocked":
              wx.showToast({
                title: '未解锁的关卡',
                image: '../images/lock.png',
                duration: 2000
              })
              break;
          }

        }
      }
    })


  }
})