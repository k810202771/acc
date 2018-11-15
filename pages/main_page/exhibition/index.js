var apiUtils = require('../../../utils/apiUtils.js')
var utils = require('../../../utils/util.js')
var rating = require('../../../template/rating_bar/rating.js')
Page({
  onShareAppMessage: function () {
    return {
      title: '知亦行',
      desc: '随时掌控那些不能错过的展览',
      path: 'pages/main_page/exhibition/index?id=' + this.data.id
    }
  },
  data: {
    id: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    swiper: [],
    results: {},
    time: '',
    comments: [],
    counts: {
      views: 0,
      favor: 0,
      comment: 0
    },
    tag: [],
    pixelRatio: 0,
    star_state: [
      '/images/star_grey.png',
      '/images/star_grey.png',
      '/images/star_grey.png',
      '/images/star_grey.png',
      '/images/star_grey.png',
    ],
    focus: false,
    commentVaule: 'kkk',
  },
  onLoad: function (options) {
    console.log(options)

    this.setData({
      id: options.id,
    })
    // 页面初始化 options为页面跳转所带来的参数
    this.request_exhibition_data()
    this.request_exhibition_comment()
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.setNavigationBarTitle({
      title: '',
      success: function (res) {
        console.log(res)
      }
    })
  },
  exhibitionItem(e) {
    console.log(e)
    wx.navigateTo({
      url: '../exhibition_items/index?id=' + e.currentTarget.dataset.id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  request_exhibition_data: function () {
    this.getItemRank()
    var that = this;
    apiUtils.AJAX('/v1/exhibition/' + this.data.id, function (res) {
      console.log(res.data);
      var time = '';
      if (res.data.results.timeType) {
        time = '常设展览'
      } else {
        var beginTime = res.data.results.beginTime;
        var endTime = res.data.results.endTime;
        time = beginTime + '至' + endTime;

      }
      // var tags = res.data.results.tag;
      // var tag = []
      // if(tags.length){
      //  for (var i of tags) {
      //   tag.push(utils.type_arr[i])
      // }
      // }


      // console.log(tag)
      var counts = {
        views: res.data.results.views,
        favor: res.data.results.favoriteCount,
        comment: res.data.results.commentCount
      }

      that.setData({
        swiper: res.data.results.slider,
        results: res.data.results,
        time: time,
        counts: counts,
        // tag: tag
      })
    })
  },
  comment_click() {
    wx.navigateTo({
      url: '../../comment/index?id=' + this.data.id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  tapEvent(e) {
    // this.changeTap(e)
    this.comment_click()
  },
  getItemRank() {
    var that = this;
    apiUtils.AJAX('/v1/rank?id=' + this.data.id, function (res) {
      rating.setStars(that, parseInt(res.data.results.stars))


    })
  },
  postComment() {
    var info = wx.getStorageSync('zyx_user')
    if (!info) {
      wx.showToast({
        title: '请先登录',
        duration: 2000
      })
      app.askForUserInfo()
      return;
    }
    if (!this.data.commentValue) {
      wx.showToast({
        title: '内容不能为空',
        duration: 2000
      })
      return;
    }

    var that = this;
    apiUtils.AJAX('/v1/exhibition/' + this.data.id + '/comment', function (res) {
      console.log(res)
      // that.request_comment_data();
      if (res.data.status) {
        that.request_exhibition_comment()
        var counts = that.data.counts
        counts.comment = parseInt(counts.comment) + 1;  
        var results = that.data.results
         results.commentCount=  parseInt(results.commentCount)+1;
        that.setData({
          results:results,
          counts: counts
        })
      }



    }, 'post', {
        content: this.data.commentValue,
        rank: '5',
        sessiontoken: info.sessiontoken
      })
  },
  formSubmit(e) {
    // console.log(e)
  },
  commentClick(e) {
    // console.log(this.data.commentValue)
    this.postComment()
  },
  input(e) {
    this.setData({
      commentValue: e.detail.value
    })
    console.log(e)
  },
  redirect_comment_list(e) {
    wx.navigateTo({
      url: '../../../comment_list/index?id=' + this.data.id,
      success: function (res) {

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  request_exhibition_comment() {
    var that = this;
    apiUtils.AJAX('/v1/comment?objectId=' + this.data.id, function (res) {
      console.log(res.data)
      //判断是不是用户评论的
      var info = wx.getStorageSync('zyx_user')
      utils.isUserSelfComment(info, res.data.results)
      that.setData({
        comments: res.data.results
      })
    })
  },
  del_comment(e) {
    utils.del_comment(this,e,this.request_exhibition_comment,apiUtils)
  }

})