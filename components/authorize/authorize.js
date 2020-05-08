const app = getApp()
const $api = require('../../utils/request.js').API;
Component({
	//组件的对外属性 说的确实很官方，用过vue组件的就很容易理解这点
	//父级向子级传值这里就是接收值得地方
  properties:{
  	//名称要和父级绑定的名称相同
  	//这里主要是控制自动授权弹框是否显示 true=隐藏 false=显示
    iShidden:{
      type:Boolean,//定义类型
      value: true,//定义默认值
    },
    //是否自动登录 这里主要用于没有授权是否自动弹出授权提示框 
    //**用在不自动登录页面但是某些操作需要授权登录**
    isAuto:{
      type: Boolean,
      value: true,
    },
  },
  //组件的内部数据，和 properties 一同用于组件的模板渲染
  data:{
    currstatus:null,
    ishow:false,
    chooseuser:false,
    authlogin:false,
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
        console.log("授权组件显示")
        // const pages = getCurrentPages()
        // const perpage = pages[pages.length - 1]
        // perpage.onLoad()
     
     
    },
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached(){
       // console.log(options);
    // console.log(decodeURIComponent(options.q))//得到二维码地址
 
    // let storageKey = wx.getStorageSync('userInfo');
    // let binduser = wx.getStorageSync('binduser');
    // if(storageKey){ 
    //   var a=2;
    //   console.log("执行授权===========")
    //  if(a==2){
    //     // 授权成功未绑定
    //     wx.navigateTo({
    //       url: '/pages/login/login',
    //     })
    //     this.setData({
    //       authlogin:false,
    //       chooseuser:false,
    //       binduser:true
    //     })
    //   }else{
    //     // 授权成功有多个可绑定的账号   
    //     this.setData({
    //       chooseuser: true,
    //       authlogin:false,
    //       binduser:false
    //     })
    //   }
    // }else{
    //   this.setData({
    //     authlogin:true,
    //     chooseuser:false,
    //     binduser:false
    //   })
    // }
  },
  //组件的方法 
  methods:{
     //验证登录是否过期
 checksession:function(){
  let that = this;
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
//  绑定账号
acountStatus(){
  let openid = wx.getStorageSync('userInfo').openid;
  // let binduser = wx.getStorageSync('bindacount')
  let that = this;
  // if(binduser){
  //   const pages = getCurrentPages()
  //   const perpage = pages[pages.length - 1]
  //   perpage.onLoad()
  // }else{
    $api.mockApi({ openid: openid }).then(data => {
      console.log(data)
      that.setData({
        currstatus:3
      })
      var curracount = that.data.currstatus
      console.log(curracount)
      if(curracount==1){
        // 只有一个账号
        that.hideDialog()
        wx.setStorageSync('bindacount', true);
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()
      }else if(curracount==2){
        // 有多个账号
        that.showDialog()
        that.setData({
          chooseuser:true,
          authlogin:false
        })
      }else{
        // 没有账号
        that.hideDialog()
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
       //请求成功
    })
    .catch(err => {
       //请求失败
    })
  // }
  
},
    authStatu(){
      var that = this;
      // 判断用户是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            console.log('已授权')
            that.checksession()
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
          }else{
            console.log('未授权')
            // wx.removeStorageSync('userInfo');
            that.setData({
              authlogin:true,
              chooseuser:false
            })
          }
        }
      })
    },
    //当用户第一次拒绝后再次请求授权
  openConfirm: function () {
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
            success: (res) => { }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },
    attacheds(){
      console.log("======技术1=======")
      let storageKey = wx.getStorageSync('userInfo');
      let binduser = wx.getStorageSync('binduser');
      if(storageKey){ 
        $api.mockApi({page: 1,pageSize: 50}).then(res => {
          console.log(res)
            //请求成功
        })
        .catch(err => {
            //请求失败
        })
        var a=4;
        console.log("======技术2=======")
       if(a==2){
          // 授权成功未绑定
          
          this.setData({
            authlogin:false,
            chooseuser:false,
            binduser:true
          })
        }else if(a==3){
          // 授权成功有多个可绑定的账号   
          this.setData({
            chooseuser: true,
            authlogin:false,
            binduser:false
          })
       
              console.log("======技术3=======")
        }else{
          wx.setStorage({
            key: 'binduser',
            data: true,
          })
        }
      }else{
        this.setData({
          authlogin:true,
          chooseuser:false,
          binduser:false
        })
        console.log("======技术5=======")
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
    //去授权
    getUserInfo(e){
      var that = this;
      let detail = e.detail;
      if (detail.errMsg == "getUserInfo:fail auth deny") {
        that.openConfirm();//如果拒绝，在这里进行再次获取授权的操作
        // 拒绝授权
        // wx.showToast({
        //   title: '请授权登录',
        //   icon: 'none'
        // })
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        console.log(pages)
        console.log(perpage.__route__)
        if(perpage.__route__=="pages/index/index" || perpage.__route__=="pages/detail/detail"){
         that.hideDialog()
        }
      } else {
        // 允许授权
        // 判断是否登录
        that.checksession()
        // app.globalData.userInfo = detail.userInfo;
        // wx.setStorage({
        //   key: 'userInfo',
        //   data: detail.userInfo,
        // })
        // requestUrl.requestUrl({//将用户信息传给后台数据库
        //   url: "/QXEV/xxx/xxx",
        //   params: {
        //     openId: globalOpenId,//用户的唯一标识
        //     nickName: e.detail.userInfo.nickName,//微信昵称
        //     avatarUrl: e.detail.userInfo.avatarUrl,//微信头像
        //     province: e.detail.userInfo.province,//用户注册的省
        //     city: e.detail.userInfo.city//用户注册的市
        //   },
        //   method: "post",
        // })
        //   .then((data) => {//then接收一个参数，是函数，并且会拿到我们在requestUrl中调用resolve时传的的参数
        //       console.log("允许授权了");
        //   })
        //   .catch((errorMsg) => {
        //     console.log(errorMsg)
        //   })
          // wx.switchTab({
          //   url: '../index/index',
          // })
          // app.globalData.hasauth = true
          // const pages = getCurrentPages()
          // const perpage = pages[pages.length - 1]
          // console.log(perpage)
          // perpage.onLoad()
          // var a=2;
          // if(a==1){
          //   // 授权成功+绑定
          //   // this.triggerEvent('okEvent', { hasauth:true }, {})
          //   wx.setStorage({
          //     key: 'binduser',
          //     data: true,
          //   })
          //   const pages = getCurrentPages()
          //   const perpage = pages[pages.length - 1]
          //   perpage.onLoad()            
          // }else if(a==2){
          //   // 授权成功未绑定    
          //   console.log(111)        
          //   this.setData({
          //     authlogin:false,
          //     chooseuser:false,
          //     binduser:true
          //   })
          //   wx.navigateTo({
          //     url: '/pages/login/login',
          //   })
          // }else{
          //   // 授权成功有多个可绑定的账号   
          //   this.setData({
          //     authlogin:false,
          //     chooseuser:true,
          //     binduser:false
          //   })
          // }
          // this.setData({
          //   ishow: false
          // })
          
      }
      
    },
  // onClose:function(){
  //   this.setData({
  //     show:false
  //   })
  // },
  // onChange(event) {
  //   const { picker, value, index } = event.detail;
  //   console.log(`当前值：${value}, 当前索引：${index}`);
  // },
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
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1]
    perpage.onLoad()
    })
    .catch(err => {
       //请求失败
    })
  
  },
  goUrl(){
    var a=1
    if(a==2){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  }
  }
  })