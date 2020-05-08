//index.js
//获取应用实例
const app = getApp()
const $api = require('../../utils/request.js').API;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  goDetail: function() {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  bindViewTap:function(){
    this.logo= this.selectComponent(".authorize");
    let storageKey = wx.getStorageSync('userInfo');
    let binduser = wx.getStorageSync('bindacount');
    if (storageKey && binduser){
            this.logo.hideDialog();//调用子组件的方法
    }else{
      this.logo.authStatu()
      this.logo.showDialog();//调用子组件的方法
    }
  },
  onLoad: function () {

  }
})
