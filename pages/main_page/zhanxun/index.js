var apiUtils = require('../../../utils/apiUtils.js')
var WxParse = require('../../../wxParse/wxParse.js');
var utils = require('../../../utils/util.js')
var app = getApp()
Page({
  onShareAppMessage: function () {
    var that = this;
    var zyx_user = wx.getStorageSync('zyx_user');
    return {
      title: this.data.resultsData.nameBase,
      imageUrl: "https://www.zhanapp.com.cn/php/5x4_img.php?url=" + this.data.resultsData.cover.url,
      desc: '随时掌控那些不能错过的展览',
      path: 'pages/main_page/zhanxun/index?scene=' + this.data.id,
      total:0,
      success:function(){
        app.Ajax("POST",{
          title:"分享中",
          url:"https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=share",
          data: "sessiontoken=" + zyx_user.sessiontoken + "&from=exinfo",
          success:function(res){
            console.log(res);
            if (res.data.results.bounds.code) {
              that.setData({
                card: { id: res.data.results.bounds.cardid, display: true, width: app.globalData.windowdata.screenWidth, pixelRatio: app.globalData.windowdata.pixelRatio }
              })
            }
          }
        })
      }
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
    tag: [],
    focus: false,
    commentVaule: 'kkk'
  },
  onLoad: function (options) {
    var that = this;

    if (app.globalData.windowdata) {
      that.setData({
        data: app.globalData.windowdata,
      })
    } else {
      wx.getSystemInfo({
        success: function (res) {
          app.globalData.windowdata = res;
          that.setData({
            data: app.globalData.windowdata,
          })
        }
      })
    }


    if (options.scene.length == 15){
      app.Ajax("GET",{
        url: "https://www.zhanapp.com.cn/php/zhanapp-php/distribution.php?scene=" + options.scene,
          success:function(zhanxun_data){
            console.log(zhanxun_data);

            //var distribution = wx.getStorageSync('distribution'); //获取分销信息

            //设置分销信息
            wx.setStorageSync('distribution', { id: zhanxun_data.data.product_id, idtype: zhanxun_data.data.platform_type, identifier: options.scene});

            that.setData({
              id: zhanxun_data.data.zhanxunid
            })

            that.request_zhanxun_data()
          }
      })
    }else{

      that.setData({
        id: options.scene
      })

      that.request_zhanxun_data()

    }




  },
  onReady: function () {
    // 页面渲染完成
    /*
    this.request_zhanxun_data()
    this.request_comment_data()*/
  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  request_zhanxun_data: function () {
    var that = this;
    console.log('加载Exinfo');
    apiUtils.AJAX('/v1/exinfo/' + this.data.id, function (res) {
      console.log('success------')
      console.log("展讯数据",res);
      app.globalData.PlatformType = res.data.results.ticket_type;
      console.log('平台类型--------');
      console.log(app.globalData.PlatformType);
      //加载评论
      that.request_comment_data()
      //
      var counts = {
        views: res.data.results.views,
        favor: res.data.results.favors,
        comment: res.data.results.comments
      }
      that.setData({
        group_buy_id: res.data.results.group_buy_id,
        resultsData: res.data.results,
        counts: counts,
        shopid: res.data.results.ticket_id,
        shoptype: res.data.results.ticket_type,
        video_url: res.data.results.video_url
      });

      WxParse.wxParse('zhanxun', 'html', res.data.results.content, that, 5);

      // console.log(res.data.results);
      // var tags = res.data.results.tag;
      // var tag = res.data.results.tag;
      // for (var i of tags) {
      //   tag.push(type_arr[i]);
      // }
      // console.log(tag)
      /*

      // console.log(counts);

      var content = res.data.results.content;
       //console.log(content);
      // WxParse.wxParse('html', content, that)
      WxParse.wxParse('zhanxun', 'html', res.data.results.content, that, 5);*/
    })
  },
  request_comment_data: function () {
    var that = this;
    apiUtils.AJAX('/v1/comment?page=1&limit=6&objectId=' + this.data.id, function (res) {
      console.log(res);
       var info = wx.getStorageSync('zyx_user')
      utils.isUserSelfComment(info, res.data.results)
      that.setData({
        comment: res.data.results,
        total:res.data.count
      })
    })
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
  wxParseImgTap: function (e) {
    var that = this
    WxParse.wxParseImgTap(e, that)
  },
  wxParseImgLoad: function (e) {
    var that = this
    WxParse.wxParseImgLoad(e, that)
  },
  postComment() {
 var info=wx.getStorageSync('zyx_user')

    if (!info) {
      wx.showToast({
        title: '请先登录',
        duration: 1000
      })
      setTimeout(function(){
        App.ShareIndexPages();
      },1000)
      //////////////////////////////////////////////////////////////////
      return;
    }
    if(!this.data.commentValue){
       wx.showToast({
        title: '内容不能为空',
        duration: 2000
      })
      return;
    }

    var that = this;
    apiUtils.AJAX('/v1/exinfo/' + this.data.id + '/comment', function (res) {
      console.log(res);
        wx.hideLoading()
        if (res.data.results.code){
          that.setData({
            card: { id: res.data.results.cardid , display: true, width: app.globalData.windowdata.screenWidth, pixelRatio:app.globalData.windowdata.pixelRatio }
          })
        }
        wx.showToast({
          title: '评论完成',
          duration: 1000
        })
        
        if(res.data.status){
         that.request_comment_data();
       var counts= that.data.counts
     counts.comment=  parseInt(counts.comment)+1
       that.setData({
       counts:counts
       })
      }
    

    }, 'post', {
        content: this.data.commentValue,
        rank: '5',
        sessiontoken: info.sessiontoken
      })

    this.setData({
      commentValue:null
    })
    wx.showLoading({
      title: '正在提交',
      mask:true
    })
  },
  formSubmit(e) {
    // console.log(e)
  },
  del_comment(e) {
    utils.del_comment(this,e,this.request_comment_data,apiUtils)
  },
  code_tap(){
    console.log( 'http://zyxart.leanapp.cn/api/v1/wxa/code?'+'path=pages/main_page/zhanxun/index?id=' + this.data.id)
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: ['http://zyxart.leanapp.cn/api/v1/wxa/code?'+'path=pages/zhanxun/index?id=' + this.data.id],
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
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
  clickpls:function(res){
    switch (res.currentTarget.dataset.type){
      case "group":
        wx.navigateTo({
          url: "../../shop/choice/index?id=" + this.data.group_buy_id + "&type=" + this.data.shoptype + "&group=true"
        })
        break;
      case "shop":
        wx.navigateTo({
          url: "../../shop/choice/index?id=" + this.data.shopid + "&type=" + this.data.shoptype
        })
        break;
    }

  },
  fenxiangclick:function(){
    var that = this;
    wx.showLoading({
      title: "生成中",
      mask: true
    })
    wx.request({
      url: "https://www.zhanapp.com.cn/api/v1/exinfo2jpeg?id=" + this.data.id + "&viewport_width=600",
      success: function (res) {

        wx.downloadFile({
          url: res.data.fo.url,
          success: function (res) {
            wx.showLoading({
              title: "保存中",
              mask: true
            })
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                
                wx.showModal({
                  title: '保存成功',
                  content: '图片已经保存到相册，可以分享到朋友圈了',
                  showCancel: false
                })
                //生成图片获得卡片
                //版本更新不在自动登录
                var zyx_user = wx.getStorageSync('zyx_user');
                app.Ajax("POST", {
                  title: "分享中",
                  url: "https://www.zhanapp.com.cn/api/v1/wxapp/action?action_name=share",
                  data: "sessiontoken=" + zyx_user.sessiontoken + "&from=exinfo_pic",
                  success: function (res) {
                    console.log(res);
                    if (res.data.results.bounds.code) {
                      that.setData({
                        card: { id: res.data.results.bounds.cardid, display: true, width: app.globalData.windowdata.screenWidth, pixelRatio: app.globalData.windowdata.pixelRatio }
                      })
                    }
                  }
                })

              },
              fail: function (res) {
                wx.openSetting()
              },
              complete: function () {
                wx.hideLoading();
              }
            })
          }
        })
      }
    })

  },
  click: function (res) {
    switch (res.currentTarget.dataset.type) {
      case "card_close":
        this.setData({
          card: { id: 1, display: false, width: App.globalData.windowdata.screenWidth, pixelRatio: App.globalData.windowdata.pixelRatio }
        })
        break;
      case "card_jump":
        wx.navigateTo({
          url: "/pages/Games/fragment/index"
        })
        /*
        wx.redirectTo({
          url: "/pages/Games/fragment/index"
        })*/
        break;
    }
  }
})