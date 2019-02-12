//获取应用实例
const app = getApp()

var mine = require( '../../views/mine/mine.js' ),
	serviceCart = require( '../../service/cart/cart' ),
	views,
	_fn;
  //home = require( '../../views/home/home.js' ),
	//sort = require( '../../views/sort/sort.js' ),
	//cart = require( '../../views/cart/cart.js' ),

views = {
	//home : home,
	//sort : sort,
	//cart : cart,
	mine : mine
}

Page( {
	data : {
    currentData: mine,
    is_auth: app.globalData.is_auth,
    userInfo: app.globalData.userInfo,
    hasUserInfo: app.globalData.hasUserInfo,
		cart : {
			num : 0
		},
		currentView : '',
		tabs : [
    //   {
		// 	text : '首页',
		// 	className : 'home',
		// 	view : 'home'
		// },
    // {
		// 	text : '分类',
		// 	className : 'sort',
		// 	view : 'sort'
		// },
    // {
		// 	text : '购物车',
		// 	className : 'cart',
		// 	view : 'cart'
		// },
    {
			text : '用户中心',
			className : 'mine',
			view : 'mine'
		}]
	},
	onReady : function(  ) {
    _fn.selectView.call(this, 'mine' );
	},

	onShow : function() {
		// 每次显示都刷新一次购物车
		// 这样保证在商详添加后在首页也能显示
		// var self = this;
		// serviceCart.get( function( res ) {
		// 	self.setData( {
		// 		'cart.num' : res.data.num
		// 	} );
		// } );
	},

	changeTab : function( e ) {
		var currentTarget = e.currentTarget,
			view = currentTarget.dataset.view;

		if ( !view ) {
			return;
		}

		// 请求数据，渲染对应页面
		this.setData( {
			currentView : view
		} );
		_fn.selectView.call( this, view );

	},
	clickProxy : function( e ) {
		var cTarget = e.currentTarget,
			dataset = cTarget.dataset;
		if ( views[dataset.view] && typeof views[dataset.view][dataset.func] == 'function' ) {
			views[dataset.view][dataset.func]( this, e );
		}
	},
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasUserInfo,
        is_auth: app.globalData.is_auth
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: app.globalData.hasUserInfo,
          is_auth: app.globalData.is_auth
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          app.globalData.hasUserInfo = true
          app.globalData.is_auth = 1
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: app.globalData.hasUserInfo,
            is_auth: app.globalData.is_auth
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo = app.globalData.hasUserInfo
    app.globalData.is_auth = app.globalData.is_auth
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: app.globalData.hasUserInfo,
      is_auth: app.globalData.is_auth
    })
  }
} );

_fn = {
	selectView : function( view ) {
		var view = views[view];
		if ( !view ) {
			return;
		}
		view.render( this );
	}
}