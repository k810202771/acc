var choiceItem = [0, 0, 0, 0, 0, 0, 0, 0]; //每项选中
var dataDisplay = [0, 0, 0, 0, 0, 0]; //每项得分
var list = [
  {
    title:"旅行时你喜欢去的地方是？",
    anwser: ["海边","爬山","草原","只想宅在家里"],
    add: [3, 2, 0, [4,40]],
    subtract:[]
  },
  {
    title: "你的书桌或者办公桌平时是什么样子的？",
    anwser: ["东西很少，摆放整齐", "东西不少，但是非常整齐", "随手一扔，随机摆放", "非常乱，找东西时再说"],
    add: [1, 2, 4, [5,20]],
    subtract: [, , ,[[0, 0, 10]]]
  },
  {
    title: "你的穿衣风格是？",
    anwser: ["必须要时尚", "舒服就行", "职业装是我的最爱", "有什么穿什么"],
    add: [2, 0, 3, 4],
    subtract: []
  },
  {
    title: "你最喜欢一天的哪个时段？",
    anwser: ["清晨", "中午", "傍晚", "晚上"],
    add: [3, 1, 4, [0, 20]],
    subtract: []
    
  },
  {
    title: "三原色你最喜欢哪一个？",
    anwser: ["红色", "黄色", "蓝色", "都不喜欢"],
    add: [4, [0, 20], 3, [5, 20]],
    subtract: [, , , [[0, 2, 10], [0, 3, 10]]]

  },
  {
    title: "如果让你做一幅画，你会选择画？",
    anwser: ["风景", "植物", "人物", "餐桌"],
    add: [3, 0, [[1, 10], [2, 10]], 4],
    subtract: []

  },
  {
    title: "你最喜欢的天气是？",
    anwser: ["阳光明媚，蓝天白云", "雨天", "雪天", "无所谓"],
    add: [0, [3, 20], 3, [5, 30]],
    subtract: []

  },
  {
    title: "你最想去参观下面的哪个地方？",
    anwser: ["卢浮宫", "大英博物馆", "梵高博物馆", "798的MUSE展"],
    add: [3, 2, [0, 20], [[0,10], [1,10], [2,10], [3,10], [4,10]]],
    subtract: [null, null, null, [[0, 1], [0, 4], [0, 6]]]
  }
]

// pages/Games/video/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:true,
    playButton:true,
    list:list,
    disappear:'',
    page_index:0,
    skipshow:false,
    guodushow: false
  },
  myevent(res){
    this.setData({
      disappear:'disappear 400ms;'
    })
    setTimeout(function(){
      this.data.page_index ++;
      if (this.data.page_index >= this.data.list.length){
        wx.redirectTo({
          url: './over/index?data=' + JSON.stringify(dataDisplay)
        })
      }
      this.setData({
        disappear: '',
        page_index: this.data.page_index
      })
    }.bind(this),400)

    choiceItem[this.data.page_index] = res.currentTarget.dataset.id
    
    this._jia(list[this.data.page_index].add[res.currentTarget.dataset.id]);
    this._jian(list[this.data.page_index].subtract[res.currentTarget.dataset.id]);

    console.log(dataDisplay);
  },
  _jian(value){
    if(typeof value == "object"){

        for (var i = 0; i < value.length; i++) {

          switch (value[i][0]) {
            case 0: //加
              var topicid = value[i][1] //题目id
              var Subtract = value[i][2] //要减去的分数
              var choise = choiceItem[topicid]; //选择的选项id
              var _value = list[topicid].add[choise];

              if (typeof _value == "number") {
                if (Subtract){
                  dataDisplay[_value] -= Subtract;
                }else{
                  dataDisplay[_value] -= 10
                }
              }else{
                if (typeof _value[0] == "number"){

                  if (Subtract) {
                    dataDisplay[_value[0]] -= Subtract;
                  } else {
                    dataDisplay[_value[0]] -= _value[1]
                  }

                }else{

                  for (var t = 0; t < _value.length; t++) {
                    if (Subtract) {
                      dataDisplay[_value[t][0]] -= Subtract;
                    } else {
                      dataDisplay[_value[t][0]] -= _value[t][1];
                    }

                  }

                }

              }

              break;
            case 1: //减
              break;
          }

      }

    }
  },
  _jia(value) { //加得分
    if(typeof value == "number"){
      dataDisplay[value] += 10;
    }else{
      if (typeof value[0] == "number") {
        dataDisplay[value[0]] += value[1]
      }else{
        for (var i = 0; i < value.length; i++) {
            if (typeof value[i] == "number") {
              dataDisplay[value[i]] += 10
            } else {
              dataDisplay[value[i][0]] += value[i][1]
            }
        }
      }

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (App.ShareIndexPages()) {
      if (options.show){
        this.setData({
          show:false
        })
      }
      wx.getSystemInfo({
        success: function (res) {
          var v_width = 406;
          var v_height = 760;
          var bl = v_height / v_width;//res.windowWidth / res.windowHeight;
          if(res.windowWidth * bl > res.windowHeight){
            var width = res.windowWidth;
            var height = res.windowWidth * bl;
          }else{
            var bl = v_width / v_height;//res.windowWidth / res.windowHeight;
            var width = res.windowHeight * bl;
            var height = res.windowHeight;
          }


          console.log(res);
          this.setData({
            width: width,
            height: height
          })
        }.bind(this)
      })
    }
  },
  start(){
    console.log(1)
    this.setData({
      playButton:false
    })
    var Video = wx.createVideoContext("Video");
    Video.play();
  },
  end(){
    console.log(2)
    var Video = wx.createVideoContext("Video");
    Video.pause();

  },
  videoend(res){
    if (res.detail.currentTime >= parseInt(res.detail.duration) - 5) {
      this.setData({
        guodushow: true
      })
    }
    if (res.detail.currentTime >= parseInt(res.detail.duration) - 2){
      this.end();
      this.setData({
        animation: "animation: anpaly 1s;animation-fill-mode: forwards;"
      })
      setTimeout(function(){
        this.setData({
          show: false
        })
      }.bind(this),1000)
    }
    if (res.detail.currentTime >= 10){
      this.setData({
        skipshow: true
      })
    }
  },
  skip(){
    this.setData({
      show: false
    })
  },
  onShareAppMessage: function () {
    return{
      title: "你有一身的艺术细菌你造吗？",
      imageUrl: "https://static.zhanapp.com.cn/video/share.jpg",
      path: '/pages/Games/video/index'
    }
  }
})