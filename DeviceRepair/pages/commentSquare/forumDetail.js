// pages/commentSquare/forumDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const postId = options.postId;
    if (postId) {
      this.loadPostDetail(postId);
    } 
    else {
      wx.showToast({
        title: '帖子信息错误',
        icon: 'none'
      });
      // 可以选择返回上一页或其他操作
      wx.navigateBack();
    }
  },

  loadPostDetail: function (postId) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/WxServlet_war_exploded/forum?requestType=detail&postId=' + postId,
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            detail: res.data
          });
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      },
      fail: function () {
        wx.showToast({
          title: '请求失败',
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