// pages/mine/mine.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isauth:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    // console.log(app.globalData.hasauth)
    // this.logo= this.selectComponent(".authorize");
    // //判断缓存中有没有授权信息，如果没有就显示弹窗，有就直接隐藏弹窗
    // let storageKey = wx.getStorageSync('userInfo');
    // let binduser = wx.getStorageSync('binduser');
    // if (storageKey && binduser){
    //   wx.getStorage({
    //     key: 'userInfo',
    //     success: (res) => {
    //       if (res.data) {
    //         app.globalData.userInfo = res.data;
    //         this.setData({
    //           isauth: app.globalData.hasauth
    //          })
    //         this.logo.hideDialog();//调用子组件的方法
    //       }
    //     },
    //   })
    // }else{
    //   this.logo.showDialog();//调用子组件的方法
    //   this.logo.attacheds()
    // }
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
    // let that = this;
    // that.setData({
    //   isauth: app.globalData.hasauth
    // })
     // //判断缓存中有没有授权信息，如果没有就显示弹窗，有就直接隐藏弹窗
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

  },
  // okEvent: function (e) {
  //   let that = this;
  //   that.setData({
  //     isauth: e.detail.hasauth
  //   })  
  // }
})