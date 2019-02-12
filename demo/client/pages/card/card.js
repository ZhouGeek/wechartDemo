//index.js
var wxbarcode = require('../../utils/index.js');

Page({

  data: {
    code: ''
  },
  onLoad: function (option) {
    wx.showLoading({
      title: '加载中...',
    })
    var card = option.card;
    var userId = option.userId;
    console.log(card + "..." + userId);
    if (card != null && card != undefined && card != '') {
      wxbarcode.barcode('barcode', card, 680, 200);
      wxbarcode.qrcode('qrcode', card, 420, 420);
      this.setData({
        code: card
      })
    }
    wx.hideLoading();
  }
})