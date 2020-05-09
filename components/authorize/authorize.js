const app = getApp()
const $api = require('../../utils/request.js').API;
Component({
	//组件的对外属性 说的确实很官方，用过vue组件的就很容易理解这点
	//父级向子级传值这里就是接收值得地方
  properties:{},
  //组件的内部数据，和 properties 一同用于组件的模板渲染
  data:{
    currstatus:null,
    ishow:false,
    chooseuser:false,
    alreadyauth:false,
    binduser:false,
    chooseuser:false,
    columns: [{ text: '杭州', id:1 },
    { text: '宁波',id:2 },
    { text: '温州',id:3 }],
    canIUse: wx.canIUse('button.open-type.getUserInfo')//获取用户信息是否在当前版本可用
  },
  //组件所在页面的生命周期声明对象
  pageLifetimes:{
  	//页面隐藏
  	hide:function(){
    },
    //页面打开
    show:function(){
    
    },
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached(){
  },
  //组件的方法 
  methods:{
    authStatu(){
      var that = this;
      // 判断用户是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            console.log('已授权')
            // that.checksession()
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
        // 拒绝授权
      } else {
        // 允许授权
        // 判断是否登录
        that.checksession()
      }
      
    },
    //当用户第一次拒绝后再次请求授权
    openConfirm: function () {
      var that = this
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
          } else {
            console.log('用户点击取消')
            that.onloadCurr()
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
    // let binduser = wx.getStorageSync('bindacount')
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
          that.onloadCurr()
        }else if(curracount==2){
          // 有多个账号
          // that.showDialog()
          that.setData({
            alreadyauth:false,
            chooseuser:true
          })
        }else{
          // 没有账号
          // that.hideDialog()
          that.setData({
            alreadyauth:false
          })
          wx.navigateTo({
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
  // 用户拦截
  commonAuth:function(call){
    var that = this;
    let storageKey = wx.getStorageSync('userInfo');
    let binduser = wx.getStorageSync('bindacount');
    if (storageKey && binduser){
      that.hideDialog();//调用子组件的方法
      call(true)
    }else{
      that.showDialog();//调用子组件的方法
    new Promise(function(resolve,reject){
      that.authStatu()
     }).then(function(){
        call(false)  
     })
    }
  },
  // 隐藏授权弹窗
  hideDialog(){
    this.setData({
      ishow: false
    })
  },
  //显示授权弹窗
  showDialog(){
    this.setData({
      ishow: true
    })
  },
  // onreadyCurr(){
  //   const pages = getCurrentPages()
  //   const perpage = pages[pages.length - 1]
  //   perpage.onReady()
  // },
  onloadCurr(){
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1]
    perpage.onLoad()
  },
  onConfirm(event) {
    let that = this;
    console.log( event)
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    $api.bindAcount({ id:1 }).then(data => {
      wx.setStorageSync('bindacount', true);
      that.setData({
        ishow:false
      })
      that.onloadCurr()
    })
    .catch(err => {
       //请求失败
    })
  
  }
  }
  })