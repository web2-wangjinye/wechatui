const Util=require("./util.js")
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const baseURL = 'https://api.it120.cc'+'/wjyandxss';

function request(method,url,data,header) {
    data = data || {};
    header = header || { 
      // "Content-Type": "application/x-www-form-urlencoded", 
      'content-type': method == GET ? 'application/json' : 'application/x-www-form-urlencoded'
    //   "Access-Token": wx.getStorageSync('userInfo').token
    }
    let promise = new Promise(function(resolve,reject){
      wx.request({
        url: baseURL+url,
        header:header,
        data:method==GET?data:Util.json2Form(data),
        method:method,
        success:function(res){
       
          if (res.code==601){
            wx.showToast({
              title: '请重新登录',
              icon: "none"
            });
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('bindacount')
            
            // setTimeout(function () {
            //   wx.navigateTo({
            //     url: '/pages/auth/auth',
            //   })
            // }, 1000);
            reject('请重新登录');
          }
          resolve(res);
        },
        fail: function () {//reject
          wx.showToast({
            title: '请求有误，稍后重试',
            icon: "none"
          });
        },
        complete:function(){
  
        }
      })
    })
    return promise

    // return new Promise(function(resolve, reject) {
    //     let header = {
    //         'content-type': 'application/json',
    //     };
    //     wx.request({
    //         url: baseURL + url,
    //         method: method,
    //         data: method === POST ? JSON.stringify(data) : data,
    //         header: header,
    //         success(res) {
    //             //请求成功
    //             //判断状态码---errCode状态根据后端定义来判断
    //             if (res.data.errCode == 0) {
    //                 resolve(res);
    //             } else {
    //                 //其他异常
    //                 reject('运行时错误,请稍后再试');
    //             }
    //         },
    //         fail(err) {
    //             //请求失败
    //             reject(err)
    //         }
    //     })
    // })
}

//api
const API = {
  getOpenid: (data) => request(GET, `jsapi/mini?jsCode=${data}`),
  // 绑定账户
  bindAcount:(data) => request(POST,'/user/friend/list',data),
  // 判断账户绑定状态
  mockApi:(data) => request(POST,'/user/friend/list',data),
  // 登录接口
  login:(data) => request(POST,'/user/wxapp/login',data),
};
module.exports = {
  API: API
}
// const $api = require('../../utils/api.js').API;
// Page({
//     data: {},
//     onLoad: function (options) {
//         wx.login({
//             success:res=> {
//                 // 调用接口获取openid
//                 $api.getOpenid(res.code)
//                     .then(res => {
//                        //请求成功
//                     })
//                     .catch(err => {
//                        //请求失败
//                     })
//             }
//         })
//     }
// })