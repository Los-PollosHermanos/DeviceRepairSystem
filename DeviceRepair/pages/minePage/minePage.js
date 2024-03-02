// pages/minePage/minePage.js
var app = getApp();
var isLoginSuccess = false;

Page({

     /**
      * 页面的初始数据
      */
     data: {
          userTitle: '点击登录',
          userHead: '../../res/images/ic_mine_normal.png',
          userInfo: {},
          hasUserInfo: false,
          canIUseGetUserProfile: wx.canIUse('getUserProfile'),
          memberType: '男',  // 示例数据，根据需要调整
          points: '江安校长办公室',       // 示例数据，根据需要调整
          coupons: '我爱程序员，秃头太爽啦！',         // 示例数据，根据需要调整
          showPopup: false,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          // this.initLoginMsg();
     },

    toggleEditPopup: function() {
      this.setData({
          showPopup: !this.data.showPopup
      });
    },

    handleInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
        [field]: e.detail.value
    });
    },

    submitEdit: function() {
    // 这里可以添加提交更改的逻辑
    console.log('更新的会员类型:', this.data.memberType);
    console.log('更新的积分:', this.data.points);
    console.log('更新的优惠券数量:', this.data.coupons);
    // 关闭弹窗
    this.toggleEditPopup();
    },

     previewHead: function () {
          wx.previewImage({
               current: this.data.userHead,
               urls: [this.data.userHead]
          })
     },

     loginTap: function () {
      if (!this.data.hasUserInfo) {
           this.getUserProfile();
      }
 },

 // 获取用户信息
 getUserProfile: function () {
      wx.getUserProfile({
           desc: '用于完善会员资料',
           success: (res) => {
                this.setData({
                     userInfo: res.userInfo,
                     hasUserInfo: true
                });
                // 可以在此处更新全局用户信息或进行其他操作
           },
           fail: () => {
                // 处理用户拒绝授权的情况
           }
      });
 },

     initLoginMsg: function () {
          if (app.globalData.userInfo) {
               isLoginSuccess = true;
               this.setData({
                    userHead: app.globalData.userInfo.avatarUrl,
                    userTitle: '尊贵的，' + app.globalData.userInfo.nickName
               })
          } else if (this.data.canIUse) {
               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
               // 所以此处加入 callback 以防止这种情况
               isLoginSuccess = true;
               app.userInfoReadyCallback = res => {
                    this.setData({
                         userHead: res.userInfo.avatarUrl,
                         userTitle: '尊贵的，' + res.userInfo.nickName
                    })
               }
          } else {
               // 在没有 open-type=getUserInfo 版本的兼容处理
               wx.getUserInfo({
                    success: res => {
                         isLoginSuccess = true;
                         app.globalData.userInfo = res.userInfo
                         this.setData({
                              userHead: res.userInfo.avatarUrl,
                              userTitle: '尊贵的，' + res.userInfo.nickName
                         })
                    },
                    fail() {
                         isLoginSuccess = false;
                         this.setData({
                              userTitle: '点击登录',
                              userHead: '../../res/images/ic_mine_normal.png'
                         })
                    }
               })
          }
     },

     allOrderTap: function () {
          wx.navigateTo({
               url: '../orderList/orderList',
          })
     },

     todoOrderTap: function () {
          wx.navigateTo({
               url: './todoOrderList',
          })
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {

     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {

     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {

     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})