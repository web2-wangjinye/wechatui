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
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏 
    topNum: 0,
    showModal: false, // 显示modal弹窗
    single: false, // false 只显示一个按钮，如果想显示两个改为true即可
    modaldata: null
  },
  //事件处理函数
  goDetail: function() {
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  bindViewTap:function(){
  },
  guanzhu:function(){

  },
  lower() {
    var result = this.data.res;

    var resArr = [];
    for (let i = 0; i < 10; i++) {
      resArr.push(i);
    };
    var cont = result.concat(resArr);
    // console.log(resArr.length);
    // console.log(cont)
    if (cont.length >= 40) {
      this.setData({  
        searchLoadingComplete: true, //把“没有数据”设为true，显示  
        searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
      }); 
      return false;
    } else {
      this.setData({  
        searchLoadingComplete: false,
        searchLoading: true 
      }); 
      setTimeout(() => {
        this.setData({
          res: cont
        });
        wx.hideLoading();
      }, 1500)
    }
  },
  // 获取滚动条当前位置
  scrolltoupper:function(e){
    // console.log(e)
    if (e.detail.scrollTop > 100) {
      this.setData({
        cangotop: true
      });
    } else {
      this.setData({
        cangotop: false
      });
    }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    this.setData({
      topNum:0
    });
  },
  showModal(istwo,modaldata){
    var that = this;
    that.setData({
      showModal: true,
      single:istwo?false:true,
      modaldata:modaldata
    })
  },
  modalCancel(e) {
    console.log('点击了取消')
  },
  modalConfirm(e) {
    console.log(e)
    console.log('点击了确定')
  },
  onLoad: function () {
    // this.selectComponent(".authorize").hideDialog();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  onReady:function(){  
  },
  onHide: function () {
 
  },
})
