var index = -1, timer, shudu, jiangpin = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prize:[
      { width: 0, name: "《梵高手稿》", img: "https://www.zhanapp.com.cn/img/0323/prize/1.png", type: "Pbutton",suffix:'一本'},
      { width: 0, name: "10积分", img: "https://www.zhanapp.com.cn/img/0323/prize/2.png", type: "Pbutton", suffix:''},
      { width: 0, name: "谢谢参与", img: "https://www.zhanapp.com.cn/img/0323/prize/5.png", type: "Pbutton", suffix:''},
      { width: 0, name: "谢谢参与", img: "https://www.zhanapp.com.cn/img/0323/prize/5.png", type: "Pbutton", suffix:''},
      { width: 0, name: "", img: "https://www.zhanapp.com.cn/img/0323/prize/0.png", type: "Kbutton", suffix:''},
      { width: 0, name: "100积分", img: "https://www.zhanapp.com.cn/img/0323/prize/2.png", type: "Pbutton", suffix:''},
      { width: 0, name: "《我的家在紫禁城》", img: "https://www.zhanapp.com.cn/img/0323/prize/4.png", type: "Pbutton", suffix:'一本'},
      { width: 0, name: "谢谢参与", img: "https://www.zhanapp.com.cn/img/0323/prize/5.png", type: "Pbutton", suffix:""},
      { width: 0, name: "IPhoneX", img: "https://www.zhanapp.com.cn/img/0323/prize/3.png", type: "Pbutton", suffix:'一台'},
    ],
    jiangpin:{
      show:"none"
    },
    w_t_left: '请选择地址',
    w_t_right:'>'
  },
  butlist:function(){
    wx.navigateTo({
      url: "./LuckList/index"
    })
  },
  openBorder:function(){
    if(index == -1){
      var prize = this.data.prize;
      prize[4].type = "Kbutton";
      this.setData({
        prize: prize
      })
      prize[4].type = "Kbutton almt";
      this.setData({
        prize: prize
      })
      index = 0;
      wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=draw",
        data: "sessiontoken=" + this.data.info.sessiontoken,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(res);
          if (res.data.status == 0){

            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.error.message,
            })
            index = -1;
            return false;
          }
          shudu = parseInt(Math.random() * 9) + 5;
          clearTimeout(timer);
          console.log(res.data.results.bounds, res.data.results.winningId)
          this.play(res.data.results.bounds, res.data.results.winningId);

          var info = wx.getStorageSync('zyx_user');
          info.current_power = res.data.results.user.current_power
          info.points = res.data.results.user.points
          wx.setStorageSync('zyx_user', info)
          this.setData({
            info: info
          })

        }.bind(this)
      });
    }
  },
  updata:function(){
    if (this.data.telNumber){
      console.log("sessiontoken=" + this.data.info.sessiontoken + "&winningId=" + this.data.jUid + "&consignee=" + this.data.userName + "&phone=" + this.data.telNumber + "&address=" + this.data.city)
      wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=reward_info",
        data: "sessiontoken=" + this.data.info.sessiontoken + "&winningId=" + this.data.jUid + "&consignee=" + this.data.userName + "&phone=" + this.data.telNumber + "&address=" + this.data.city,
        method: "POST",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          if(res.data.status == 0){
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.error.message,
            })
          }else{
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.results.message,
              success:function(){
                this.setData({
                  jiangpin: {
                    show: 'none'
                  }
                })
              }.bind(this)
            })
          }
        }.bind(this)
      })
    }else{
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '地址不能为空。',
      })
    }
  },
  onWxWindow:function(){
    wx.chooseAddress({
      success: function (res) {
        this.setData({
          w_t_left: res.userName + ' ' + res.telNumber,
          w_t_right: res.provinceName + res.cityName + res.countyName + res.detailInfo,
          userName: res.userName,
          telNumber: res.telNumber,
          city: res.provinceName + res.cityName + res.countyName + res.detailInfo
        })
      }.bind(this)
    })
  },
  play: function (bounds,uid){
    var shunxu = [0, 1, 2, 5, 8 ,7, 6, 3];

    shudu = shudu + shudu * 0.07;

    timer = setTimeout(function () {
      if (shudu < 300 || this.data.prize[shunxu[index]].boundsId != bounds) {
        this.play(bounds,uid)
      } else {
        //抽中奖品
        if (this.data.prize[shunxu[index]].type != "vobj"){
          this.setData({
            jiangpin: {
              show: 'bolck',
              name: this.data.prize[shunxu[index]].name,
              suffix: this.data.prize[shunxu[index]].suffix
            },
            jUid: uid
          })
        }else{
          var info = this.data.info;
          //更新用户积分体力值数据
          wx.request({
            url: "https://www.zhanapp.com.cn/api/v1/wxapp/user/status?sessiontoken=" + info.sessiontoken,
            method: "GET",
            header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
            success: function (res) {
              console.log(res)
              info.current_power = res.data.results.current_power
              info.points = res.data.results.points
              wx.setStorageSync('zyx_user', info)
              this.setData({
                info: info
              })
            }.bind(this)
          })
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: this.data.prize[shunxu[index]].name,
          })
        }
        index = -1;
      };
    }.bind(this), shudu)
    index++;
    if (index >= shunxu.length) index = 0;

    var prize = this.data.prize;
    for (var o = 0; o < shunxu.length; o++) {
      if (o == index) {
        prize[shunxu[o]].width = 4;
      } else {
        prize[shunxu[o]].width = 0;
      }
    }
    this.setData({
      prize: prize
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (App.ShareIndexPages()){
      var imgs = wx.getStorageSync('resources');
      var info = wx.getStorageSync('zyx_user');
      console.log(info);
      this.setData({
        info: info,
        imgs: {
          Winning: App.getIcon('恭喜您', imgs)
        }
      })

      //获取奖品列表
      wx.request({
        url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=prize",
        method: "GET",
        header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        success: function (res) {
          console.log(res);
          var prize = [];
          for (var i = 0; i < res.data.prize.length; i++) {
            if (i == 4) {
              prize.push({ img: "https://www.zhanapp.com.cn/img/0323/prize/0.png", type: "Kbutton" });
            }
            prize.push(res.data.prize[i]);
          }
          this.setData({
            prize: prize
          })
        }.bind(this)
      })

    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})