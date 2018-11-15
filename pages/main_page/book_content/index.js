var apiUtils = require('../../../utils/apiUtils.js')
var WxParse = require('../../../wxParse/wxParse.js');
var utils = require('../../../utils/util.js')
var app = getApp()
Page({
  onShareAppMessage: function () {
    return {
      title: '知亦行',
      desc: '随时掌控那些不能错过的展览',
      path: 'pages/main_page/book_content/index?id=' + this.data.id
    }
  },
  data: {
    id: "",
    wxParseData: [],
    resultsData: [],
    comment: [],
    counts: {
      views: 0,
      favor: 0,
      comment: 0
    },
    types: '',
    focus: false,
    commentVaule: 'kkk',
    total:0,
  },
  onLoad: function (options) {
    console.log(options.id)


    this.setData({
      id: options.id,
      types: options.type,
    })
  },
  onReady: function () {
    // 页面渲染完成
    this.request_zhanxun_data()
    this.request_comment_data()

  },
  onShow: function () {
    // 页面显示
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '',
      success: function (res) {
        // success
      }
    })
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  request_zhanxun_data: function () {
    var that = this;
    apiUtils.AJAX('/v1/archives/' + this.data.id, function (res) {
      var counts = {
        views: res.data.results.views,
        favor: res.data.results.favors,
        comment: res.data.results.comments
      }
      that.setData({
        resultsData: res.data.results,
        counts: counts,
      })
      // WxParse.wxParse('html', res.data.results.content, that)
      WxParse.wxParse('book_content', 'html', res.data.results.content, that, 5);
    })
  },
  request_comment_data: function () {
    var that = this;
    apiUtils.AJAX('/v1/comment?page=1&limit=6&objectId=' + this.data.id, function (res) {

       var info = wx.getStorageSync('zyx_user')
      utils.isUserSelfComment(info.objectId, res.data.results)
      that.setData({
        comment: res.data.results,
        total:res.data.count
      })
    })
  },
  wxParseImgTap: function (e) {
    var that = this
    WxParse.wxParseImgTap(e, that)
  },
  wxParseImgLoad: function (e) {
    var that = this
    WxParse.wxParseImgLoad(e, that)
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
    apiUtils.AJAX('/v1/archives/' + this.data.id + '/comment', function (res) {
      wx.showToast({
        title: '评论完成',
        duration: 1000
      })

      if (res.data.status) {
        that.request_comment_data();
        var counts = that.data.counts
        counts.comment = parseInt(counts.comment) + 1
        that.setData({
          counts: counts
        })
      }


    }, 'post', {
        content: this.data.commentValue,
        rank: '1',
        sessiontoken: info.sessiontoken
      })
  },
  commentClick(e) {
    console.log(this.data.commentValue)
    this.postComment()
  },
  input(e) {
    this.setData({
      commentValue: e.detail.value
    })
    console.log(e)
  },
   del_comment(e) {
    utils.del_comment(this,e,this.request_comment_data,apiUtils)
  },
   redirect_comment_list(e) {
    wx.navigateTo({
      url: '../../comment_list/index?id=' + this.data.id,
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
})