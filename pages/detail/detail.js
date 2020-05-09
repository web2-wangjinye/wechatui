// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: true, // 显示modal弹窗
    single: false // false 只显示一个按钮，如果想显示两个改为true即可
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectComponent(".authorize").hideDialog();
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
  bindViewTap:function(){
this.modelShow()

  },
  // 模态提示框
  modelShow:function(){
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      showCancel:false,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
  },
    // 点击取消按钮的回调函数
    modalCancel(e) {
      // 这里面处理点击取消按钮业务逻辑
      console.log('点击了取消')
    },
    // 点击确定按钮的回调函数
    modalConfirm(e) {
      console.log(e)
     // 这里面处理点击确定按钮业务逻辑
      console.log('点击了确定')
    }
})