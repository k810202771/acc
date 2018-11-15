// components/button/dt_button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value:{
      type:String,
      value:'按钮'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animation:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(){
      this.setData({
        animation:"animation .3s;"
      })

      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      
      setTimeout(function(){
        this.setData({
          animation: ""
        })
        this.triggerEvent('myevent', myEventDetail, myEventOption);
      }.bind(this),350)
    }
  }
})
