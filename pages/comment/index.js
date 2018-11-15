// pages/comment/index.js
var rating = require('../../template/rating_bar/rating.js')
var apiUtils = require('../../utils/apiUtils.js')

Page({
  data: {
    pixelRatio: 0,
    star_state: [
      '/images/star_grey.png',
      '/images/star_grey.png',
      '/images/star_grey.png',
      '/images/star_grey.png',
      '/images/star_grey.png',
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    current: 1,
    id: '',
    info: '',
    rank: '1'
  },
  onLoad: function (options) {
    console.log(options.id)
    var info = wx.getStorageSync('zyx_user')

    this.setData({
      id: options.id,
      info: info
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

    // var info = wx.getSystemInfoSync()
    // console.log(info)
    // this.setData({
    //   pixelRatio: info.pixelRatio
    // })
    rating.setPageRatio(this)
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  ballMoveEvent(e) {
    // this.changeTap(e)
    rating.changeTap(this, e, function (m) {
      console.log(m)
    })
  },
  tapEvent(e) {
    // this.changeTap(e)
    var that = this;
    rating.changeTap(this, e, function (m) {
      that.setData({
        rank: m
      })
    })
  },
  item_click(e) {
    console.log(e.target.dataset)
    this.setData({
      current: parseInt(e.target.dataset.id)
    })
  },
  change(e) {
    console.log(e)
    this.setData({
      current: parseInt(e.detail.current)
    })
  },
  onConfirmed(e) {
    console.log(e.detail.value)
    this.postComment(e.detail.value)
  },
  postComment(value) {
    if (!this.data.info) {
      wx.showToast({
        title: '请先登录',
        duration: 2000
      })
      return;
    }

    var tag = '';
    if (this.data.current == 1) {
      tag = 'viewed'
    } else {
      tag = 'want'
    }

    var that = this;
    apiUtils.AJAX('/v1/exhibition/' + this.data.id + '/comment', function (res) {
      console.log(res)
      wx.showToast({
        title: '点评完成',
        icon: 'success',
        duration: 1000
      })
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
        success: function (res) {
          // success
        },
        fail: function () {

        },
        complete: function () {
          // complete
        }
      })

    }, 'post', {
        tag: tag,
        content: value,
        rank: that.data.rank,
        sessiontoken: this.data.info.sessiontoken
      })
  },




})