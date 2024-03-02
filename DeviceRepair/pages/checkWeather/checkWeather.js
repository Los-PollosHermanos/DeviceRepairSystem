// pages/checkWeather/checkWeather.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // temp:"4",
    // low:"-1℃",
    // high:"10℃",
    // type:"晴",
    // city:"北京",
    // week:"星期二",
    // weather:"无持续风向，微风级"
    temp: "",
    low: "",
    high: "",
    type: "",
    city: "",
    week: "",
    weather: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getWeatherData();
  },

  getWeatherData: function() {
    var that = this;
    wx.request({
      url: 'https://api.seniverse.com/v3/weather/now.json',
      data: {
        key: 'S6pDGgPxuT8m8MpD0',
        location: 'chengdu',
        language: 'zh-Hans',
        unit: 'c'
      },
      success: function(res) {
        if (res.statusCode == 200 && res.data.results) {
          var weatherData = res.data.results[0];
          that.setData({
            temp: weatherData.now.temperature,
            type: weatherData.now.text,
            city: weatherData.location.path,
            timezone: weatherData.location.timezone,
            // 注意：API 不提供 low、high、week 和 weather 字段
            // 可能需要其他方式获取或省略这些信息
          });
        }
      }
    });
  },

  onFeatureTap: function() {
    wx.navigateTo({
      url: './weatherHistory'
    });
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