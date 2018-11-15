// pages/Games/video/over/index.js
var App = getApp();
var imgPositionData = ["货真价实的","卡耶博特","马蒂斯","梵高","克里姆特","雷诺阿"]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    saveShow:false,
    overflow:false
  },
  onsave(){
    var that = this;
    wx.canvasToTempFilePath({
      x:0,
      y:0,
      width: that.data.windowWidth * 0.8 * 4,
      height: that.data.windowWidth * 1.35 * 4,
      destWidth: that.data.windowWidth * 0.8 * 4,
      destHeight: that.data.windowWidth * 1.35 * 4,
      canvasId: 'save',
      success(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res){
            if(res.errMsg == "saveImageToPhotosAlbum:ok"){
              that.setData({
                saveShow:false,
                overflow: false
              })
            }
            console.log(res);
          },
          fail(res) {
            that.onTShow();
          }
        })
      }
    })
  },
  onTShow() {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        that.setData({
          b1: !res.authSetting["scope.writePhotosAlbum"] ? res.authSetting["scope.writePhotosAlbum"] == false ? true : false : false
        })
      }
    })
  },
  //点击黑色隐藏
  hidesvg(){
    this.setData({
      saveShow: false,
      overflow: false
    })
  },
  museto(){
    var url = '/pages/main_page/zhanxun/index' + '?scene=5b4708a7128fe1005b04fe17'
    wx.navigateTo({
      url: url
    })
  },
  click(){
    this.setData({
      saveShow:true,
      overflow: true
    })
    var that = this;
      //绑定Save画布

      const saveCtx = wx.createCanvasContext('save')
      saveCtx.setFillStyle("rgba(255,255,255,1)")
      saveCtx.fillRect(0, 0, that.data.windowWidth * 0.8, that.data.windowWidth * 1.35)
      saveCtx.draw();

      wx.showLoading({
        title: '生成中',
      })

      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.windowWidth,
        height: that.data.windowWidth,
        destWidth: that.data.windowWidth * 0.8 * 5,
        destHeight: that.data.windowWidth * 1.35 * 5,
        canvasId: 'dataCanvas',
        success (cres) {

          wx.downloadFile({
            url: "https://static.zhanapp.com.cn/video/svgsavebg.jpg",
            success(tres) {
              wx.downloadFile({
                url: "https://static.zhanapp.com.cn/video/weixincode.jpg",
                success(res) {
                  saveCtx.setFillStyle("rgba(255,255,255,1)")
                  saveCtx.fillRect(0, 0, that.data.windowWidth * 0.8, that.data.windowWidth * 1.35)

                  saveCtx.drawImage(tres.tempFilePath, 0, that.data.windowWidth * 1.35 - that.data.windowWidth * 0.8 * 1.5 - that.data.windowWidth * 0.15, that.data.windowWidth * 0.8, that.data.windowWidth * 0.8 * 1.5);

                  saveCtx.drawImage(cres.tempFilePath, 0, that.data.windowWidth * 1.35 - that.data.windowWidth * 0.8 - that.data.windowWidth * 0.15, that.data.windowWidth * 0.8, that.data.windowWidth * 0.8);

                  saveCtx.drawImage(res.tempFilePath, that.data.windowWidth * 0.8 - that.data.windowWidth * 0.15, that.data.windowWidth * 1.35 - that.data.windowWidth * 0.15, that.data.windowWidth * 0.15, that.data.windowWidth * 0.15);
                  var fontSize = that.data.windowWidth * 0.035;
                  saveCtx.setFillStyle("rgba(0,0,0,1)")
                  saveCtx.setFontSize(fontSize);
                  
                  saveCtx.fillText('测一下，你的艺术细菌有我多吗？', 30, that.data.windowWidth * 1.35 - (that.data.windowWidth * 0.15 / 2) + fontSize / 2)
                  fontSize = that.data.windowWidth * 0.04;
                  saveCtx.setFontSize(fontSize);
                  saveCtx.setFillStyle("rgba(19,29,57,1)")

                  var startLeft = that.data.windowWidth * 0.08;
                  var endLeft = that.data.windowWidth * 0.49;
                  
                  saveCtx.fillText(that.data.name, startLeft + (endLeft - startLeft - saveCtx.measureText(that.data.name).width) / 2, that.data.windowWidth * 0.06)

                  var text5 = ''
                  var texttop = 0;
                  for (var he = 0; he < that.data.title.length; he++) {

                    fontSize = that.data.windowWidth * 0.035;
                    saveCtx.setFontSize(fontSize);

                    saveCtx.fillText(that.data.title[he], startLeft + saveCtx.measureText(text5).width, that.data.windowWidth * 0.115 + texttop * that.data.windowWidth * 0.05)

                    text5 += that.data.title[he]
                    if (saveCtx.measureText(text5).width >= endLeft - startLeft - saveCtx.measureText('我').width) {
                      text5 = "";
                      texttop++;
                    }

                  }

                  saveCtx.draw()
                  wx.hideLoading();
                }
              })

            }
          })
        }
      })

  },
  rotation:function (res){

    var t = (res.d / 2);
    var n = (res.n * Math.PI);
    return{
      x: (Math.sin(n / 180) * t) + Math.sin(n / 180) * t + res.x,
      y: (Math.cos(n / 180) * t) + Math.cos(n / 180) * t + res.y
    }

  },
  onLoad: function (options) {
    var zyx_user = wx.getStorageSync('zyx_user');
    //绑定画布
    const ctx = wx.createCanvasContext('dataCanvas')
    var nbvalue;
    var distribution = this.Transformation(JSON.parse(options.data));

    var imgPosition = [];

    wx.getSystemInfo({
      success: function (res) {
        for (var nb = 0; nb < 5; nb++) {
          var text2 = '';
          var pwidth = (res.windowWidth / 24);
          for (var i = 0; i < 7; i++) {
            var cc = (i == 6 ? -1 : i)
            var d = {
              d: (nb * pwidth + 30),
              x: (res.windowWidth) / 2,
              y: res.windowWidth / 2,
              n: 360 / 6 * (cc == -1 ? 0 : i)
            };
            cc == 0 ? ctx.moveTo(this.rotation(d).x, this.rotation(d).y) : ctx.lineTo(this.rotation(d).x, this.rotation(d).y);
          }
          ctx.setFillStyle("rgba(255,255,255,0.2)")
          ctx.fill();

        }

        nbvalue = (6 * pwidth + 30) * 1.2;

        //固定图标位置
        for (var i = 0; i < 6; i++) {

          var d = {
            d: (6 * pwidth + 40),
            x: (res.windowWidth) / 2,
            y: res.windowWidth / 2,
            n: 360 / 6 * i
          };

          imgPosition.push({ name: imgPositionData[i], x: this.rotation(d).x, y: this.rotation(d).y});

        }

        this.setData({
          imgPosition: imgPosition,
          windowWidth: res.windowWidth
        })

        ctx.beginPath();
        
        var max = this.getMax(distribution);
        var Proportion = nbvalue / max;
        ctx.setLineDash([8,4]);
        for (var i = 0; i < 7; i++) {
          var d = {
            d: Proportion * distribution[i == 6 ? 0 : i] + 30,
            x: (res.windowWidth) / 2,
            y: (res.windowWidth) / 2,
            n: 360 / 6 * i
          };
          
          i == 0 ? ctx.moveTo(this.rotation(d).x, this.rotation(d).y) : ctx.lineTo(this.rotation(d).x, this.rotation(d).y);
        }
        ctx.setStrokeStyle('rgba(255,255,255,1)');
        ctx.stroke()
        ctx.setFillStyle("rgba(255,255,255,0.4)")
        ctx.fill();

        this.setData({
          name: App.filter(zyx_user.nickname),
          title: this.gettext(distribution, pwidth, res.windowWidth)
        })



      }.bind(this)
    })


    
    ctx.draw()

  },
  getMax(array,index){
    var i = 0;
    var g = 0;
    for(var p=0;p<array.length;p++){
      if(array[p] > i){
        i = array[p];
        g = p
      }
    }
    return index===true?g:i;
  },
  //取结果文本
  gettext(array, pwidth, windowWidth){

    var nbvalue = (6 * pwidth + 30) * 1.2;
    var max = this.getMax(array);
    var Proportion = nbvalue / max;

    var g = [];
    for (var p = 0; p < array.length; p++) {
      var d = {
        d: 4 * pwidth + 30,
        x: windowWidth / 2,
        y: windowWidth / 2,
        n: 360 / array.length * p
      };
      var l = {
        d: Proportion * array[p] + 30,
        x: windowWidth / 2,
        y: windowWidth / 2,
        n: 360 / array.length * p
      };
      
      var el = this.rotation(l);
      var pel = this.rotation(d);
      switch(p){
        case 0:
          if (el.y > pel.y){
            g.push(0);
          }
          break;
        case 1:
          if (el.y > pel.y && el.x > pel.x) {
            g.push(1);
          }
          break;
        case 2:
          if (el.y < pel.y && el.x > pel.x) {
            g.push(2);
          }
          break;
        case 3:
          if (el.y < pel.y) {
            g.push(3);
          }
          break;
        case 4:
          if (el.y < pel.y && el.x < pel.x) {
            g.push(4);
          }
          break;
        case 5:
          if (el.y > pel.y && el.x < pel.x) {
            g.push(5);
          }
          break;
      }
    }
    var text = '';
    switch (g.length){
      case 1:
        switch(g[0]){
          case 0:
            text = "货真价实的细菌遍布全身，可能艺术与你真的不来电！"
            break;
          case 1:
            text = "“卡耶博特”细菌遍布全身，巴黎雨天的街道就是为你准备！"
            break;
          case 2:
            text = "“马蒂斯”细菌遍布全身，你就是传说中的野兽派。"
            break;
          case 3:
            text = "“梵高”细菌遍布全身，洗个澡都掉落一地的星空。"
            break;
          case 4:
            text = "“克里姆特”细菌遍布全身，你家开金矿吗？"
            break;
          case 5:
            text = "“雷诺阿”细菌遍布全身，印象派中画美女最多的就是你。"
            break;
        }
        break;
      case 2:
        if (this.doesItInclude(g, 0, 1)){
          text = "让卡耶博特在巴黎放弃了绘画。"
        } else if (this.doesItInclude(g, 0, 2)){
          text = "具有野兽派的风格，可惜最后跑偏了！"
        } else if (this.doesItInclude(g, 0, 3)) {
          text = "让梵高也很纠结，你到底适不适合画画呢？"
        } else if (this.doesItInclude(g, 0, 4)) {
          text = "虽然家里有个矿，但是被挥霍的差不多了。"
        } else if (this.doesItInclude(g, 0, 5)) {
          text = "让雷诺阿也很犯愁，可能要放弃画笔。"
        } else if (this.doesItInclude(g, 1, 2)) {
          text = "画笔一挥，巴黎的浪漫风格变成了野兽派！"
        } else if (this.doesItInclude(g, 1, 3)) {
          text = "正在创作中的画《下雨天巴黎上空的星夜》"
        } else if (this.doesItInclude(g, 1, 4)) {
          text = "画笔一挥，巴黎的雨变成了金子！"
        } else if (this.doesItInclude(g, 1, 5)) {
          text = "在浪漫的巴黎画了很多美女"
        } else if (this.doesItInclude(g, 2, 3)) {
          text = "就是后印象派中的野兽派"
        } else if (this.doesItInclude(g, 2, 4)) {
          text = "让野兽派焕发除了金灿灿的光芒！"
        } else if (this.doesItInclude(g, 2, 5)) {
          text = "画的一幅野兽派《舞蹈》在印象派中掀起了巨浪！"
        } else if (this.doesItInclude(g, 3, 4)) {
          text = "用金子画了一幅星夜，因为家里真的有金矿！"
        } else if (this.doesItInclude(g, 3, 5)) {
          text = "印象派与后印象派通吃！"
        } else if (this.doesItInclude(g, 4, 5)) {
          text = "用金子画画，让印象派的投来了羡慕的眼光。"
        }
        break;
      default:
        var t = [
          "自己也分不清，自己是什么风格。",
          "办了个人画展，集印象派、后印象派、野兽派于大成者",
          "随手画一幅画，就能秒杀美术史上的所有画派。",
          "一个人办了一个博览会，让世界都惊呆了！",
          "画了一幅画《金光灿灿的野兽派的巴黎的美女看星空》"
        ]
        text = t[parseInt(Math.random() * t.length + 1) - 1];
        break;
    }

    return text;
  },
  doesItInclude(){
    return arguments[0].indexOf(arguments[1]) != -1 && arguments[0].indexOf(arguments[2]) != -1;
  },
  Transformation(array){
    
    var arr = [];
    arr[0] = array[5];
    arr[1] = array[3];
    arr[2] = array[4];
    arr[3] = array[0];
    arr[4] = array[2];
    arr[5] = array[1];

    return arr;
  },
  retest(){
    console.log(123)
    wx.redirectTo({
      url: '../index?show=true'
    })
  },
  onShareAppMessage: function () {
    return{
      title: "【" +this.data.name +"】"+ this.data.title,
      imageUrl:"https://static.zhanapp.com.cn/video/share.jpg",
      path: '/pages/Games/video/index'
    }
  }
})