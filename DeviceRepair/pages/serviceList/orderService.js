// pages/serviceList/orderService.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    remarks: '',
    address: '',
    categoryId: '',
    userId: '1', 
    initialPrice: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      categoryId: options.categoryId,
      userId: '1' // 假设获取到的用户ID
    });
  },

  inputRemarks: function(e) {
    this.setData({ remarks: e.detail.value });
  },

  inputAddress: function(e) {
    this.setData({ address: e.detail.value });
  },

  submitOrder: function() {
    const { remarks, address, categoryId } = this.data;
    const orderTime = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '');
    wx.request({
      url: 'http://localhost:8080/WxServlet_war_exploded/service?requestType=createOrder',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      data: {
        userId: 1,
        remarks: remarks,
        address: address,
        categoryId: categoryId,
        initialPrice: 100,
        orderTime: orderTime,
        completionTime: null
      },
      success: function(res) {
        wx.showToast({
          title: '下单成功！',
          icon: 'success',
          duration: 1000,
          complete: function() {
            // 使用 switchTab 而不是 navigateTo来导航到tabBar页面
            wx.switchTab({
              url: '/pages/homePage/homePage' // 确保这是 tabBar 页面的正确路径
            });
          }
        });
      },
      // 添加错误处理
      fail: function() {
        wx.showToast({
          title: '下单失败，请重试',
          icon: 'none'
        });
      }
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