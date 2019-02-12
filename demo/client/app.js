//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    console.log("start-------------");
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'http://111.231.145.78:8085/sys/user/queryByOpenId/' + res.code,
            method: 'post',
            data: {},
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.globalData.userDetail = res.data.data;
              console.log(res.data.data);
              wx.hideLoading();
            },
            fail: function () {
              console.log("请求失败");
              wx.hideLoading();
            }
          })
        } else {
          console.log('登录失败！');
          wx.hideLoading();
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("aleaready auth-----------");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log("wx.getUserInfo---------");
              //授权状态
              this.globalData.is_auth = 1;
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              this.globalData.hasUserInfo = true;
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              };

            }
          })
        }
      }
    })
  },
  globalData: {
    appid: 'wx8ec5498e88015894',
    secret: '89ca98136e4abb11462a05566fcb6fac',
    userInfo: null,
    hasUserInfo: false,
    is_auth: 0,    //登录后返回的授权状态：0未授权，1已授权
    userDetail: null
  }
});