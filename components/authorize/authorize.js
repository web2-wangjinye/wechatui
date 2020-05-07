const app = getApp()
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
  
    },
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached(){
    let storageKey = wx.getStorageSync('userInfo');
    let binduser = wx.getStorageSync('binduser');
    if(storageKey){ 
      var a=3;
     if(a==2){
        // 授权成功未绑定
        wx.navigateTo({
          url: '/pages/login/login',
        })
        this.setData({
          authlogin:false,
          chooseuser:false,
          binduser:true
        })
      }else{
        // 授权成功有多个可绑定的账号   
        this.setData({
          chooseuser: true,
          authlogin:false,
          binduser:false
        })
      }
    }else{
      this.setData({
        authlogin:true,
        chooseuser:false,
        binduser:false
      })
    }
  },
  //组件的方法 
  methods:{
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
    //授权
    getUserInfo(e){
      let detail = e.detail;
      if (detail.errMsg == "getUserInfo:fail auth deny") {
        wx.showToast({
          title: '请授权登录',
          icon: 'none'
        })
      } else {
        
        app.globalData.userInfo = detail.userInfo;
        wx.setStorage({
          key: 'userInfo',
          data: detail.userInfo,
        })
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
          app.globalData.hasauth = true
          var a=3;
          if(a==1){
            // 授权成功+绑定
            // this.triggerEvent('okEvent', { hasauth:true }, {})
            wx.setStorage({
              key: 'binduser',
              data: true,
            })
            const pages = getCurrentPages()
            const perpage = pages[pages.length - 1]
            perpage.onLoad()            
          }else if(a==2){
            // 授权成功未绑定    
            console.log(111)        
            this.setData({
              authlogin:false,
              chooseuser:false,
              binduser:true
            })
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }else{
            // 授权成功有多个可绑定的账号   
            this.setData({
              authlogin:false,
              chooseuser:true,
              binduser:false
            })
          }
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
    console.log( event)
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      ishow:false
    })
    wx.setStorage({
      key: 'binduser',
      data: true,
    })
    const pages = getCurrentPages()
    console.log(pages)
    const perpage = pages[pages.length - 1]
    perpage.onLoad()
  }
  }
  })