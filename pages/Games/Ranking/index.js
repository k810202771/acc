function StarMax(a, t) {
  var array = [];
  for (var i = 1; i <= t; i++) {
    array.push({ jb: a, dj: i });
  }
  return array;
}
var listdata = [];

var level = [
  { icon: "", name: "青铜", level: StarMax(0, 1), text: 'Ⅰ' },
  { icon: "", name: "青铜", level: StarMax(1, 2), text: 'Ⅱ' },
  { icon: "", name: "青铜", level: StarMax(2, 3), text: 'Ⅲ' },
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
  { icon: "", name: "王者联赛", level: StarMax(15, 1), text: '' }
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Selected:0,
    listdata: [],
    scrollyTF:true,
    pageIndex:1,
    scrolltop:0,
    userrank:{
      rank:0,
      name:"",
      img:"",
      current_start:0,
      has_reward:0,
      level:0
    }
  },
  onheadbutton: function (e, page){
    var info = wx.getStorageSync('zyx_user');
    //资源文件刷新
    var imgs = wx.getStorageSync('resources');

    if (!page) {
      page = 1
      this.setData({
        scrolltop:0,
        pageIndex:1
      })
    };
    if(this.data.city != e){
      listdata = [];
    }
    this.setData({
      city: e
    })

    switch (e.currentTarget.dataset.index){
      case "0":
        this.setData({
          Selected:0
        })
        wx.request({
          url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=game_rank&sessiontoken=" + info.sessiontoken + "&page=" + page + "&limit=10",
          method: "GET",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (res) {
            console.log(res);
            for (var i = 0; i < res.data.results.length;i++){
              listdata.push(
                {
                  img: res.data.results[i].headimgurl.replace("/0", "/132"),
                 name: res.data.results[i].nickname,
                 city: App.getChina(res.data.results[i].city),
                 tn: level[parseInt(res.data.results[i].level ? res.data.results[i].level : 1) - 1].name + level[parseInt(res.data.results[i].level ? res.data.results[i].level : 1) - 1].text,
                 score: res.data.results[i].current_start,
                 iconimg: (parseInt(res.data.results[i].level ? res.data.results[i].level : 1) - 1 >= 15?App.getIcon('王者星星', imgs) : App.getIcon('黄色星星', imgs))
                }
              )
            }
            this.setData({
              listdata: listdata,
              scrollyTF: true
            })
            wx.hideLoading();

          }.bind(this)
        })
        //显示自己
        wx.request({
          url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=user_rank&sessiontoken=" + info.sessiontoken,
          method: "GET",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (res) {
            console.log(res);
            this.setData({
              userrank:{
                rank: res.data.results.current_rank,
                name: res.data.results.user.nickname,
                img: res.data.results.user.headimgurl,
                current_start: res.data.results.user.current_start,
                has_reward: res.data.results.user.has_reward,
                city: App.getChina(res.data.results.user.city),
                level: level[parseInt(res.data.results.user.level ? res.data.results.user.level : 1) - 1].name + level[parseInt(res.data.results.user.level ? res.data.results.user.level : 1) - 1].text,
                iconimg: (parseInt(res.data.results.user.level ? res.data.results.user.level : 1) - 1 >= 15 ? App.getIcon('王者星星', imgs) : App.getIcon('黄色星星', imgs))
              }
            })
            
          }.bind(this)
        })
        
      break;
      case "1":
        this.setData({
          Selected:1
        })
        wx.request({
          url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=game_rank&city=" + info.city + "&sessiontoken=" + info.sessiontoken + "&page=" + page + "&limit=10",
          method: "GET",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (res) {
            for (var i = 0; i < res.data.results.length; i++) {
              listdata.push(
                {
                  img: res.data.results[i].headimgurl.replace("/0", "/132"),
                  name: res.data.results[i].nickname,
                  city: App.getChina(res.data.results[i].city),
                  tn: level[parseInt(res.data.results[i].level ? res.data.results[i].level : 1) - 1].name + level[parseInt(res.data.results[i].level ? res.data.results[i].level : 1) - 1].text,
                  score: res.data.results[i].current_start,
                  iconimg: (parseInt(res.data.results[i].level ? res.data.results[i].level : 1) - 1 >= 15 ? App.getIcon('王者星星', imgs) : App.getIcon('黄色星星', imgs))
                }
              )
            }
            this.setData({
              listdata: listdata,
              scrollyTF: true
            })
            wx.hideLoading();

          }.bind(this)
        })

        //显示自己
        wx.request({
          url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=user_rank&sessiontoken=" + info.sessiontoken + "&city=" + info.city,
          method: "GET",
          header: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
          success: function (res) {
            console.log(res);
            this.setData({
              userrank: {
                rank: res.data.results.current_rank,
                name: res.data.results.user.nickname,
                img: res.data.results.user.headimgurl,
                current_start: res.data.results.user.current_start,
                has_reward: res.data.results.user.has_reward,
                city: App.getChina(res.data.results.user.city),
                level: level[parseInt(res.data.results.user.level ? res.data.results.user.level : 1) - 1].name + level[parseInt(res.data.results.user.level ? res.data.results.user.level : 1) - 1].text,
                iconimg: (parseInt(res.data.results.user.level ? res.data.results.user.level : 1) - 1 >= 15 ? App.getIcon('王者星星', imgs) : App.getIcon('黄色星星', imgs))
              }
            })

          }.bind(this)
        })
      break;
    }
  },
  scrolltolower:function(){
    if (this.data.scrollyTF){
      this.data.pageIndex++
      wx.showLoading({
        title: '加载中',
        success: function () {
          this.setData({
            scrollyTF: false,
            pageIndex: this.data.pageIndex
          })
          this.onheadbutton(this.data.city, this.data.pageIndex);
        }.bind(this)
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var e = {currentTarget:{dataset:{index:"0"}}};
    this.onheadbutton(e,this.data.pageIndex);
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
    //资源文件刷新
    var imgs = wx.getStorageSync('resources');
    return {
      title: '进入王者联赛，走上知识巅峰！',
      path: '/pages/Games/index',
      imageUrl: App.getIcon('分享图2', imgs),
      success: function (res) {
        wx.showModal({
          title: '分享成功',
          content: '体力 +' + res.data.results.bounds_power_points,
          showCancel: false
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '分享失败',
          content: '您可能取消了分享',
          showCancel: false
        })
      }
    }
  }

})