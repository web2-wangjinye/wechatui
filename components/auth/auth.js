// pages/auth/auth.js
const $api = require('../../utils/request.js').API;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),//获取用户信息是否在当前版本可用
    alreadyauth:true,
    currstatus:null,
    chooseuser:false,
    columns: [{ text: '杭州', id:1 },
    { text: '宁波',id:2 },
    { text: '温州',id:3 }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
      // 判断用户是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            console.log('已授权')
            that.setData({
              alreadyauth:false
            })

          }else{
            console.log('未授权')
            that.setData({
              alreadyauth:true
            })
          }
        }
      })
  },
      //去授权
    getUserInfo(e){
      var that = this;
      let detail = e.detail;
      if (detail.errMsg == "getUserInfo:fail auth deny") {
        that.openConfirm();//如果拒绝，在这里进行再次获取授权的操作
        // const pages = getCurrentPages()
        // const perpage = pages[pages.length - 1]
        // console.log(pages)
        // console.log(perpage.__route__)
        // if(perpage.__route__=="pages/index/index" || perpage.__route__=="pages/detail/detail"){
        //  that.hideDialog()
        // }
      } else {
        // 允许授权
        // 判断是否登录
        that.setData({
          alreadyauth:false
        })
        that.checksession()
      }
    },
     //当用户第一次拒绝后再次请求授权
  openConfirm: function () {
    var that = this;
    wx.showModal({
      content: '检测到您没打开此小程序的用户权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { 
              console.log(res)
              // 判断用户是否授权
              wx.getSetting({
                success: function (res) {
                  if (res.authSetting['scope.userInfo']) {
                    // console.log('已授权')
                    that.setData({
                      alreadyauth:false
                    })
                    that.checksession()
                  }else{
                    // console.log('未授权')
                    that.setData({
                      alreadyauth:true
                    })
                  }
                }
              })
            }
          })
        } else {
          // console.log('用户点击取消')
        }
      }
    });
  },
  // 绑定账号
  bindAcount:function(){
    var that = this;
    that.checksession()
  },
  //验证登录是否过期
  checksession:function(){
  let that = this;
  wx.showLoading({
    title: '请求中',
  })
  wx.checkSession({
    success:function(res){
    console.log(res,'登录未过期')
    that.acountStatus()
    },
    fail:function(res){
    console.log(res,'登录过期了')
    //再次调用wx.login()
      wx.login({
        success: function (res) {
          //console.log(res);
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              let iv = res.iv;
              let encryptedData = res.encryptedData;
              // 下面开始调用注册接口
              $api.login({ code: code, encryptedData: encryptedData, iv: iv }).then(data => {
                res.openid='123343vdgfyudagusf234jca'
                wx.setStorageSync('userInfo', res);
                //请求成功
                that.acountStatus()
              })
              .catch(err => {
                  //请求失败
              })
  
            }
          })
        }
      })
    }
  })
  },
  //  查询该用户所属账号
acountStatus(){
  let openid = wx.getStorageSync('userInfo').openid;
  let that = this;
    $api.mockApi({ openid: openid }).then(data => {
      console.log(data)
      that.setData({
        currstatus:1
      })
      var curracount = that.data.currstatus
      console.log(curracount)
      if(curracount==1){
        // 只有一个账号
        // that.hideDialog()
        wx.setStorageSync('bindacount', true);
        wx.navigateBack({
          delta: 1
        })
      }else if(curracount==2){
        // 有多个账号
        that.setData({
          alreadyauth:false,
          chooseuser:true
        })
      }else{
        // 没有账号
        that.setData({
          alreadyauth:false
        })
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
      wx.hideLoading()
       //请求成功
    })
    .catch(err => {
       //请求失败
    })
},
onConfirm(event) {
  let that = this;
  console.log( event)
  const { picker, value, index } = event.detail;
  console.log(`当前值：${value}, 当前索引：${index}`);
  $api.bindAcount({ id:1 }).then(data => {
    wx.setStorageSync('bindacount', true);
  // const pages = getCurrentPages()
  // const perpage = pages[pages.length - 1]
  // perpage.onLoad()
  //返回上一级关闭当前页面
  wx.navigateBack({
    delta: 1
  })
  })
  .catch(err => {
     //请求失败
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

  }
})