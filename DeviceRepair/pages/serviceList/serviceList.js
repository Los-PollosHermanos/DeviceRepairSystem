// pages/serviceList/serviceList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceTypes: [],
    orderCount: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadServiceTypes();
  },

  loadServiceTypes: function() {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/WxServlet_war_exploded/service?requestType=loadTypes',
      method: 'GET',
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            serviceTypes: res.data
          });
          that.calculateStats(); // 调用 calculateStats
        }
      }
    });
  },

  goToServiceDetail: function(e) {
    const typeId = e.currentTarget.dataset.typeid;
    wx.navigateTo({
      url: './serviceDetail?typeId=' + typeId
    });
  },

  sortById: function() {
    let sortedServiceTypes = this.data.serviceTypes.sort((a, b) => {
      return b.type_id - a.type_id;
    });
    this.setData({
      serviceTypes: sortedServiceTypes
    });
  },

  calculateStats: function() {
    let orders = this.data.serviceTypes;
    console.log("Orders: ", orders); // 查看订单列表
    let orderCount = orders.length;
    let totalAmount = 0;
    for (let i = 0; i < orders.length; i++) {
      let price = parseFloat(orders[i].actual_price);
      console.log("Order " + i + " price: ", price); // 查看每个订单的价格
      if (!isNaN(price)) {
        totalAmount += price;
      }
    }
    console.log("Total Amount: ", totalAmount); // 查看总价格
    let averagePrice = orderCount > 0 ? totalAmount / orderCount : 0;
    console.log("Average Price: ", averagePrice); // 查看平均价格
    this.setData({
      orderCount: orderCount,
      averagePrice: averagePrice
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