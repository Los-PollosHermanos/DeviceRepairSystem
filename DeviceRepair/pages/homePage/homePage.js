// pages/homePage/homePage.js
Page({

  /**
   * 页面的初始数据
   */
    data: {
      homeAdvertises: [
          {
                'imgSrc': '../../res/images/广告位招租.png',
                'webUrl': ''
          },
          {
                'imgSrc': '../../res/images/广告位招租.png',
                'webUrl': ''
          },
          {
                'imgSrc': '../../res/images/广告位招租.png',
                'webUrl': ''
          }
      ],

      features: [
        { id: 'feature1', name: '服务列表', icon: '服务列表.png' },
        { id: 'feature2', name: '我的订单', icon: '我的订单.png' },
        { id: 'feature3', name: '吐槽广场', icon: '吐槽广场.png' },
        { id: 'feature4', name: '查看天气', icon: '查看天气.png' },
        { id: 'feature5', name: '位置信息', icon: '位置信息.png' },
        // 添加更多特性...
    ],

      navigateUrl: '',
      location: '定位中...',
      startDate: '',
      currentDate: '',
      endOfStartDate: '',
      endDate: '',
      endOfEndDate: '',
      startDay: '',
      startMonth: '',
      startWeek: '',
      endDay: '',
      endMonth: '',
      endWeek: '',
      dayCount: 1,
  },

      onFeatureTap(e) {
      const featureId = e.currentTarget.dataset.id;
      // 根据 featureId 决定跳转到哪个页面
      switch (featureId) {
      case 'feature1':
      // 跳转到功能一对应的页面
      wx.navigateTo({
      url: '../serviceList/serviceList'
      });
      break;

      case 'feature2':
      // 跳转到功能二对应的页面
      wx.navigateTo({
      url: '../orderList/orderList'
      });
      break;

      case 'feature3':
      wx.navigateTo({
      url: '../commentSquare/commentSquare'
      });
      break;

      case 'feature4':
      wx.navigateTo({
      url: '../checkWeather/checkWeather'
      });
      break;

      case 'feature5':
      // 跳转到功能二对应的页面
      wx.navigateTo({
      url: '../locationInfo/locationInfo'
      });
      break;
      default:
      // 可以放置默认行为或错误处理
      break;
      }
      },

  homeAdvertisesTap: function() {
    // 跳转到广告页面
    wx.navigateTo({
      url: './advertisePage'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})