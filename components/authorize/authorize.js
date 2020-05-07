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
    cloneIner:null,
    show:true,
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
    canIUse: wx.canIUse('button.open-type.getUserInfo')//获取用户信息是否在当前版本可用
  },
  //组件所在页面的生命周期声明对象
  pageLifetimes:{
  	//页面隐藏
  	hide:function(){
      //关闭页面时销毁定时器
      if(this.data.cloneIner) clearInterval(this.data.clearInterval);
    },
    //页面打开
    show:function(){
      //打开页面销毁定时器
      if (this.data.cloneIner) clearInterval(this.data.clearInterval);
    },
  },
  //组件生命周期函数，在组件实例进入页面节点树时执行
  attached(){
    // this.setAuthStatus();
    console.log( app.globalData.hasauth)
  },
  //组件的方法 
  methods:{
  //检测登录状态并执行自动登录
  setAuthStatus(){
    var that = this;
    that.setErrorCount();
    wx.getSetting({
      success(res) {
      //这里会检测是否授权，如果授权了会直接调用自动登录
        if (!res.authSetting['scope.userInfo']) {
          //没有授权不会自动弹出登录框
          if (that.data.isAuto === false) return; 
          //自动弹出授权 
          that.setData({ iShidden: false });
        } else {
          //自动登录
          that.setData({ iShidden: true });
          if (app.globalData.token) {
          //这里是授权回调
            that.triggerEvent('onLoadFun', app.globalData.token);
            that.WatchIsLogin();
          } else {
            wx.showLoading({ title: '正在登录中' });
            //这里是已授权调用wx.getUserInfo
            that.getUserInfoBydecryptCode();
          }
        }
      }
    })
  },
  //授权
  setUserInfo(e){
    var that = this, pdata={};
    pdata.userInfo = e.detail.userInfo;
    pdata.spid = app.globalData.spid;
    wx.showLoading({ title: '正在登录中' });
    wx.login({
      success: function (res) {
        if (!res.code) return app.Tips({ title: '登录失败！' + res.errMsg});
        //获取session_key并缓存
        that.getSessionKey(res.code, function () {
          that.getUserInfoBydecryptCode();
        });
      },
      fail() {
        wx.hideLoading();
      }
    })
  },
  //从缓存中获取session_key，如果没有则请求服务器再次缓存
  getSessionKey(code,successFn,errotFn){
    var that=this;
    wx.checkSession({
      success: function (res){
        if(wx.getStorageSync('session_key'))
          successFn && successFn();
        else
          that.setCode(code, successFn, errotFn);
      },
      fail:function(){
        that.setCode(code, successFn, errotFn);
      }
    });
  },
  //访问服务器获得session_key 并存入缓存中
  setCode(code, successFn, errotFn){
    var that = this;
    app.basePost(app.U({ c: 'Login', a: 'setCode' }), { code: code }, function (res) {
      wx.setStorageSync('session_key', res.data.session_key);
      successFn && successFn(res);
    }, function (res) {
      if (errotFn) errotFn(res);
      else return app.Tips({ title: '获取session_key失败' });
    });
  },
  getUserInfoBydecryptCode: function () {
    var that = this;
    var session_key = wx.getStorageSync('session_key')
    //没有获取到session_key,打开授权页面
    //这里必须的判断存在缓存中的session_key是否存在，因为在第一步的时候，判断了
    //授权了将自动执行获取用户信息的方法
    if (!session_key) {
      wx.hideLoading();
      if(that.data.isAuto) that.setData({ iShidden: false })
      return false;
    };
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function (res) {
        var pdata = res;
        pdata.userInfo = res.userInfo;
        pdata.spid = app.globalData.spid;//获取推广人ID
        pdata.code = app.globalData.code;//获取推广人分享二维码ID
        if (res.iv) {
          pdata.iv = encodeURI(res.iv);
          pdata.encryptedData = res.encryptedData;
          pdata.session_key = session_key;
          //获取用户信息生成访问token
          app.basePost(app.U({ c: 'login', a: 'index' }), { info: pdata},function(res){
            if (res.data.status == 0) return app.Tips(
              { title: '抱歉，您已被禁止登录!' }, 
              { tab: 4, url: '/pages/login-status/login-status' }
              );
            else if(res.data.status==410){
              wx.removeStorage({ key:'session_key'});
              wx.hideLoading();
              if (that.data.iShidden == true) that.setData({ iShidden: false });
              return false;
            }
            //取消登录提示
            wx.hideLoading();
            //关闭登录弹出窗口
            that.setData({ iShidden: true, ErrorCount:0});
            //保存token和记录登录状态
            app.globalData.token = res.data.token;
            app.globalData.isLog = true;
            //执行登录完成回调
            that.triggerEvent('onLoadFun', app.globalData.uid);
            //监听登录状态
            that.WatchIsLogin();
          },function(res){
            wx.hideLoading();
            return app.Tips({title:res.msg});
          });
        } else {
          wx.hideLoading();
          return app.Tips({ title: '用户信息获取失败!'});
        }
      },
      fail: function () {
        wx.hideLoading();
that.setData({ iShidden: false });
      },
    })
  },
  //监听登录状态
  WatchIsLogin:function(){
    this.data.cloneIner=setInterval(function(){
      //防止死循环,超过错误次数终止监听
      if (this.getErrorCount()) return clearInterval(this.data.clearInterval);
      if (app.globalData.token == '') this.setAuthStatus();
    }.bind(this),800);
    this.setData({ cloneIner:this.data.cloneIner});
  },
/**
   * 处理错误次数,防止死循环
   * 
  */
  setErrorCount:function(){
    if (!this.data.ErrorCount) this.data.ErrorCount=1;
    else this.data.ErrorCount++;
    this.setData({ ErrorCount: this.data.ErrorCount});
  },
  /**
   * 获取错误次数,是否终止监听
   * 
  */
  getErrorCount:function(){
    return this.data.ErrorCount >= 10  ?  true : false;
  },
     /**
   * 点击授权按钮事件
   */
  bindGetUserInfo: function (e) {//点击的“拒绝”或者“允许
    if(e.detail.userInfo){//点击了“允许”按钮，
      var that=this;
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
        // 授权成功+绑定
        //  this.triggerEvent('okEvent', { hasauth:true }, {})
        // 授权成功未绑定
        // wx.navigateTo({
        //   url: '/pages/login/login',
        // })
        //授权成功有多个可绑定的账号    
       
    }else{
      this.setData({
        show:true
      })
    }
  },
  onClose:function(){
    this.setData({
      show:false
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
  },
  onConfirm(event) {
    const { picker, value, index } = event.detail;
    console.log(`当前值：${value}, 当前索引：${index}`);
  }
  }
  })