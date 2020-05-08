//index.js
//获取应用实例
const app = getApp()
const $api = require('../../utils/request.js').API;
Page({
  data: {
    height: '',
    res: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏 
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
  lower() {
    var result = this.data.res;

    var resArr = [];
    for (let i = 0; i < 10; i++) {
      resArr.push(i);
    };
    var cont = result.concat(resArr);
    console.log(resArr.length);
    if (cont.length >= 30) {
      this.setData({  
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
      }); 
      return false;
    } else {
      this.setData({  
        searchLoadingComplete: false, //把“没有数据”设为true，显示  
        searchLoading: true  //把"上拉加载"的变量设为false，隐藏  
      }); 
      setTimeout(() => {
        this.setData({
          res: cont
        });
        wx.hideLoading();
      }, 1500)
    }
  },
  onLoad: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  }
})
