Page({
  data: {
    
  },
  onLoad: function (options) {
    console.log(parseInt(options.type));
    this.setData({
      type: parseInt(options.type)
    })
  }
})