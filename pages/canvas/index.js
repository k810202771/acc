Page({
  data: {
    
  },
  onLoad(){
    App.ShareIndexPages("off");
  },
  onShareAppMessage: function () {
    //资源文件刷新
    var title = '中秋，创作自己的中秋图';
    var imgdata = "https://static.zhanapp.com.cn/canvas/el/share.jpg";
    var path = '/pages/canvas/index';

    return {
      title: title,
      path: path,
      imageUrl: imgdata,
      success: function () {
        wx.showModal({
          title: '提示',
          content: '分享成功！',
          showCancel: false
        })
      }
    }


  }
})