// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false, // 显示modal弹窗
    single: false, // false 只显示一个按钮，如果想显示两个改为true即可
    modaldata: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
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
  bindViewTap: function (e) {
    console.log(e)
    this.showModal(true)

  },
  bindViewTap2: function () {
 

  },
  showModal(istwo,modaldata){
    var that = this;
    that.setData({
      showModal: true,
      single:istwo?false:true,
      modaldata:modaldata
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