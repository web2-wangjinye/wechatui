// pages/concern/concern.js
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
    this.selectComponent(".authorize").hideDialog();
    this.selectComponent(".authorize").commonAuth(function(res){
      console.log(res)
    })
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
    // var that = this;
    // that.setData({
    //   isauth: app.globalData.hasauth
    // })
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
  // 接受triggerEvent 方法触发的自定义组件事件来更新同步数据
  // okEvent: function (e) {
  //   let that = this;
  //   that.setData({
  //     isauth: e.detail.hasauth
  //   })
  // }
})