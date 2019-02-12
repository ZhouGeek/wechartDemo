var handle, _fn, events,
	utils = require( '../../common/utils/utils' );

//获取应用实例
const app = getApp();

handle = {
  render : function( callerPage ) {
    console.log(callerPage);
    _fn.init( callerPage );
    var res = {
      data: {
        is_auth: app.globalData.is_auth,
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasUserInfo,
        userDetail: app.globalData.userDetail
      }
    }
    console.log(res.data);
  	callerPage.setData( {
      currentView: 'mine',
      currentData: res.data
  	} );
  }
};

events = {
  //授权用户信息
  onGotUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo !== undefined) {
      var that = this;
      let info = e.detail.userInfo;
      let paramsObj = {
        nickname: info.nickName,
        province: info.province,
        city: info.city,
        country: info.country,
        headimgurl: info.avatarUrl,
        sex: info.gender
      }
      wx.showLoading({
        title: '加载中...',
      })
      // 登录
      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: 'http://111.231.145.78:8085/sys/user/queryByOpenId/' + res.code,
              method: 'post',
              data: JSON.stringify(paramsObj),
              header: {
                'content-type': 'application/json;charsetset=UTF-8'
              },
              dataType: "json",//必须
              success: function (res) {
                wx.hideLoading();
                app.globalData.userDetail = res.data.data;
                //将全局的授权状态改为：1已授权，其他页面授权的按钮也会通过该状态看是否展示
                app.globalData.is_auth = 1;
                app.globalData.userInfo = e.detail.userInfo;
                app.globalData.hasUserInfo = true;
                //当前页面授权状态改为：1已授权
                that.setData({
                  is_auth: 1,
                  userInfo: e.detail.userInfo,
                  hasUserInfo: true,
                  userDetail: app.globalData.userDetail
                });
                //判断是否有打开过页面
                if (getCurrentPages().length != 0) {
                  //页面刷新
                  var res = {
                    data: {
                      is_auth: app.globalData.is_auth,
                      userInfo: app.globalData.userInfo,
                      hasUserInfo: app.globalData.hasUserInfo,
                      userDetail: app.globalData.userDetail
                    }
                  }
                  getCurrentPages()[getCurrentPages().length - 1].setData({
                    currentView: 'mine',
                    currentData: res.data
                  });
                } 
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
    }
  },
	mineCallPhone : function( e ) {
    console.log(app.globalData.is_auth);
    console.log(app.globalData.userInfo);
    console.log(app.globalData.hasUserInfo);
    console.log(app.globalData.userDetail);
		var phone = e.currentTarget.dataset.phone;
		wx.makePhoneCall( {
			phoneNumber : phone
		} );
	},
  getPhoneNumber : function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  card : function(e) {
    wx.navigateTo({
      url: '../card/card?userId=' + app.globalData.userDetail.userId + '&card=' + app.globalData.userDetail.card
    });
  }
}

_fn = {
	init : function( callerPage ) {
		if ( callerPage.initedMine ) {
			return;
		}
		utils.mix( callerPage, events );
		callerPage.initedMine = true;
	}
}

module.exports = handle;