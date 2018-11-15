var audio = wx.createInnerAudioContext()

var App = getApp();
var timeJL = 0;

var context = wx.createCanvasContext('firstCanvas');
var time = [], startTime = 0, AI, User, questionData;
// pages/Games/Answer/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: null,
    User: { 
      //vn连胜的次数 pn连续答对几题
      u1: { 
        img: "",
        name: "",
        vn: 0,
        pn: 0,
        pnLeft:"",
        score: 0,
        click: false,
        select: 0,

        }, 
      u2: { 
        img: "",
        name: "",
        vn: 0,
        pn: 0,
        pnLeft: "",
        score: 0,
        click: false,
        select: 0,
        level:15
        }
      },
    second:10,
    Animation:"",
    ChoiceAnimation:"",
    bili:0,
    //UserLeft: { Score: 0, click: false, select:0},
    //UserRight: { Score: 0, click: false, select:0},
    progress:0,
    problem:{
      opacity:0,
      scale:3,
      index:0
    },
    transition:"transform 1s"
  },
  onLoad: function (options) {
    timeJL = new Date().getTime();

    App.GameData.types = [];

    var imgs = wx.getStorageSync('resources');

    this.setData({
      imgs:{
        imgtrue: App.getIcon('正确', imgs),//头部背景
        imgfalse: App.getIcon('错误', imgs)//头部背景
      }
    })
    
    for (var i = 0; i < time.length; i++) {
      if (time[i])clearTimeout(time[i]);
      if (time[i])clearInterval(time[i]);
    }
    //获取题目
    questionData = App.questionData();//JSON.parse(options.questionData)
    //置入名称头像还有难度
    var UserOp = JSON.parse(options.User)
    var info = wx.getStorageSync('zyx_user');
    this.setData({
      info: info
    })

    //data数据赋值给一个全局变量
    User = this.data.User;


    User.u1.img =  UserOp.u1.img
    User.u1.name = UserOp.u1.name
    User.u2.img = UserOp.u2.img
    User.u2.name = UserOp.u2.name
    User.u2.level = options.level
    //刷新data数据
    this.setData({
      User: User
    })
    //this.DataUpdate("User", User);

    this.Refresh(questionData[this.data.problem.index]);

  },
  //更新数据
  DataUpdate:function(name,data){
    Math.
    this.setData({
      [name]:data
    })
  },
  //按下按钮
  click:function(e){
    //资源文件刷新
    var mp3s = wx.getStorageSync('resources');

    if (User.u1.select == -1 && this.data.second > 0){

      this.setData({
        Animation: "",
        bili: 1,
        ChoiceAnimation: "",
      })

      
      //左边用户得分置入
      User.u1.score = User.u1.score + (e.currentTarget.dataset.right == this.data.question.right ? this.Range(this.data.second) : 0) * (this.data.problem.index == 5 ? 2 : 1);
      //左边用户按下事件
      User.u1.click = true;
      //左边用户按下ID赋值
      User.u1.select = e.currentTarget.dataset.select;
      //答对题目累计

      if (e.currentTarget.dataset.right == this.data.question.right) {
        User.u1.pnLeft = "pnLeft_o1";
        User.u1.pn ++
        /* 答对类型+1 */
        App.GameData.types.push(this.data.question.type);
        console.log(App.GameData.types);
        /*播放声音*/
        audio.stop();
        audio.src = App.getIcon('正确声音', mp3s);
        audio.volume = 1;
        audio.seek(0);
        if (App.GameData.sound)audio.play()
      }else{
        audio.stop();
        audio.src = App.getIcon('错误声音', mp3s);
        audio.volume = 2;
        audio.seek(0);
        if (App.GameData.sound)audio.play()
        User.u1.pn = 0
      }
      //刷新data数据
      this.setData({
        User: User
      })
    //this.DataUpdate("User", User);
    }

  },
  //范围判断
  Range:function(value,a,b){
    switch (value){
      case 1:
        return 50;
      case 2:
        return 50;
      case 3:
        return 100;
      case 4:
        return 100;
      case 5:
        return 150;
      case 6:
        return 150;
      case 7:
        return 180;
      case 8:
        return 180;
      case 9:
        return 200;
      case 10:
        return 200;
      default:
        return 0;
    }
  },
  //刷新题目
  Refresh:function(data){

    wx.getNetworkType({
      success: function (res) {
        if(res.networkType == "none"){
          wx.showToast({
            title:"网络断开",
            icon:"none",
            duration:3000
          })
          wx.navigateBack();
        }
      }
    })  
    //重置动画
    this.setData({
      transition: "transform 1s",
      Animation: "",
      bili: 0,
      ChoiceAnimation: "",
      over:false
    })
    //用户按下事件取消
    User.u2.click = User.u1.click = false;
    //用户按下ID清空
    User.u2.select = User.u1.select = 0
    
    //刷新data数据
    this.setData({
      User: User
    })
    //this.DataUpdate("User", User);

    //第一步先显示第几题
    this.setData({
      problem: {
        opacity: 1,
        scale: 1,
        index: this.data.problem.index + 1
      }
    })

    clearTimeout(time[4])
    time[4] = setTimeout(function () {
      this.setData({
        problem: {
          opacity: 0,
          scale: 3,
          index: this.data.problem.index
          }
        })
    }.bind(this),1000) // 时间位置01

    //开始刷新题目
    clearTimeout(time[3])
    time[3] = setTimeout(function(){
    //////////////////////////////////////

      data.choice.sort(function(){
        return 0.5 - Math.random();
      });

      this.setData({
        over: false,
        progress: 1,
        question: {
          img: data.img!=''? data.img : null,
          text: data.text,
          right: data.right,
          difficulty: data.difficulty,
          type: data.type
        },
        choice: data.choice,
        bili: 0,
        Animation: "ChoiceButtonAnimation",
        ChoiceAnimation: "ChoiceAnimation",
      })

      clearTimeout(time[2])
      time[2] = setTimeout(function () {
        startTime = new Date().getTime();
        this.CountDown();


        //用户按下ID清空
        User.u2.select = User.u1.select = -1;
        //刷新data数据
        this.setData({
          User: User
        })
    //this.DataUpdate("User", User);

        this.AIevent();
      }.bind(this), 1100)



    //////////////////////////////////////
    }.bind(this), 2000) // 时间位置02

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  AIevent:function(){
    //重置动画
    this.setData({
      transition: "",
      Animation: "",
      bili: 1,
      ChoiceAnimation: ""
    })

    //AI智力
    var CR = 15 + this.data.User.u2.level * (60 / 16) + (45 - (45 / 100) * parseInt(this.data.question.difficulty));
    var Minimum = parseInt((40 + this.data.User.u2.level * (30 / 16)) / 10);
    var Maximum = parseInt((50 + this.data.User.u2.level * (30 / 16) + (40 - (40 / 100) * this.data.question.difficulty))/ 10)
    if (Maximum >= 9) Maximum = 9;

    AI = { time: 0, right: -1, array: [], rate: Math.random() * 100 <= CR};
    if (!AI.rate) {
      Minimum = 4;
      Maximum = 6;
    }
    console.log(AI.rate, CR, this.data.question.difficulty, Maximum , Minimum);
    AI.time = parseInt(Math.random() * (Maximum - Minimum) + Minimum + 1)
    for (var i = 0; i < this.data.choice.length;i++){
      if (this.data.choice[i] == this.data.question.right && AI.rate){
        AI.right = i;
      }else{
        if (this.data.choice[i] != this.data.question.right){
          AI.array.push(i);
        }
      }
    }
    if (!AI.rate){
      AI.right = AI.array[parseInt(Math.random() * AI.array.length)];
    }
    console.log(AI, this.data.choice[AI.right], this.data.question.right)

    clearTimeout(time[1])
    time[1] = setTimeout(function () {
    console.log(AI.time);
      //右边用户得分置入
      User.u2.score = this.data.User.u2.score + (AI.rate ? this.Range(AI.time) : 0) * (this.data.problem.index == 5 ? 2 : 1);
      //右边用户按下事件
      User.u2.click = true;
      //右边用户按下ID赋值
      //User.u2.select = AI.right+1;

      //答对题目累计
      if (AI.rate) {
        User.u2.pnLeft = "pnLeft_o2";
        User.u2.pn++
      } else {
        User.u2.pn = 0
      }
      //刷新data数据
      this.setData({
        User: User
      })
    //this.DataUpdate("User", User);

    }.bind(this), (10 - AI.time) * 1000)
  },


  //倒计时动画效果
  CountDown:function(){
    //
    time[6] = setInterval(function(){
      //时间到刷新题目
      if (this.data.second <= 0 || this.data.User.u1.click && this.data.User.u2.click) {
        this.setData({
          transition: "transform 0.5s",
          over: true,
        })
        //没选择就清空连对标签
        if(!this.data.User.u1.click){
          User.u1.pn = 0
        }
        if(!this.data.User.u2.click) {
          User.u2.pn = 0
        }
        //重置动画
        User.u1.pnLeft = "";
        User.u2.pnLeft = "";
        //右边用户按下ID赋值
        User.u2.select = AI.right + 1;
        //刷新data数据
        this.setData({
          User: User
        })
    //this.DataUpdate("User", User);

        clearTimeout(time[5])
        time[5] = setTimeout(function () {
          if (this.data.problem.index == 5) {

          } else {
            this.setData({
              bili: 0, progress: 0
            })
          }

          clearTimeout(time[4])
          time[4] = setTimeout(function () {
            //等于第五题就跳转到结算页面
            if (this.data.problem.index == 5) {
              wx.redirectTo({
                url: "../Over/index?User=" + JSON.stringify(this.data.User)
              })
            } else {
              this.Refresh(questionData[this.data.problem.index]);
            }
            
          }.bind(this), 1000)
        }.bind(this), 1500)
        clearInterval(time[0]);
        clearInterval(time[6]);
        return;
      }
    }.bind(this),200)
    // 计时器效果
    time[0] = setInterval(function () {
      var s = parseInt(360/(10*1000) * (new Date().getTime() - startTime));
      this.setData({
        second: 10 - parseInt(s * (10 / 360))
      })

      //画布内容
      var Canvas = { width: 80, height: 80, line: 6, index: s}
      context.clearRect(Canvas.width, Canvas.height, 150, 75)
      Canvas.arcWidth = (Canvas.width - Canvas.line) / 2

      context.beginPath();
      context.setStrokeStyle("#fff")
      context.setLineWidth(Canvas.line)
      context.setLineCap('round')
      context.arc(Canvas.width / 2, Canvas.height / 2, Canvas.arcWidth, 0, Math.PI * 2, true);
      context.stroke();
      context.closePath();
      
      context.beginPath();
      context.setStrokeStyle("#e08769")
      context.setLineWidth(Canvas.line / 2)
      context.arc(Canvas.width / 2, Canvas.height / 2, Canvas.arcWidth, Math.PI / 180 * -90, Math.PI / 180 * (Canvas.index - 90 + 1), true);
      context.stroke();
      context.draw();

    }.bind(this), 10)
  },
  onShow: function () {
    if(new Date().getTime() - timeJL >= 5000){
      wx.navigateBack()
    }else{
      timeJL = new Date().getTime();
    }
  },
  onHide: function () {
    timeJL = new Date().getTime();
  },
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    for (var i = 0; i < time.length;i++){
      if (time[i]) clearTimeout(time[i]);
      if (time[i]) clearInterval(time[i]);
    }
  }
})