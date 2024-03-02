// pages/minePage/todoOrderList.js
// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todo_order_list: [],
    searchQuery: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadTodoOrders();
  },

  loadTodoOrders: function() {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/WxServlet_war_exploded/order?requestType=loadTodoOrder&userId=1', // 将 userId 参数直接写入 URL
      method: 'GET',
      success: function(res) {
        if (res.statusCode == 200) {
          that.setData({
            todo_order_list: res.data
          });
          that.calculateStats(); // 调用 calculateStats
        } else {
          wx.showToast({
            title: '加载失败',
            icon: 'none'
          });
        }
      }
    });
  },

  inputSearch: function(e) {
    this.setData({
      searchQuery: e.detail.value
    });
  },

  searchTodoOrders: function() {
    var that = this;
    // 搜索逻辑，根据备注查询订单
    // 这里只是示例代码，实际应根据你的后端接口来调整
    wx.request({
      url: 'http://localhost:8080/WxServlet_war_exploded/order?requestType=searchTodoOrder&remarks=' + this.data.searchQuery,
      method: 'GET',
      success: function(res) {
        that.setData({
          todo_order_list: res.data
        });
        that.calculateStats(); // 调用 calculateStats
      },
      fail: function() {
        wx.showToast({
          title: '搜索失败',
          icon: 'none'
        });
      }
    });
  },

  deleteOrder: function(e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid; // 确保这个数据属性与您的WXML中的数据绑定相匹配
    wx.showModal({
      title: '确认',
      content: '确定要删除这个订单吗？',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: 'http://localhost:8080/WxServlet_war_exploded/order?requestType=deleteOrder&orderId=' + orderId,
            method: 'POST',
            success: function(res) {
              if (res.data.status === 'success') {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                // 重新加载订单列表
                that.loadTodoOrders();
                that.calculateStats(); // 调用 calculateStats
              } 
              else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'error',
                  duration: 2000
                });
              }
            },
            fail: function() {
              wx.showToast({
                title: '请求失败',
                icon: 'error',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },  

  onOrderClick: function(event) {
    var order_id = event.currentTarget.dataset.order_id;
    // 跳转到订单详情页面
    wx.navigateTo({
      url: './orderDetail?orderId=' + order_id
    });
  },

  sortById: function() {
    let sortedTodo_order_list = this.data.todo_order_list.sort((a, b) => {
      return b.order_id - a.order_id;
    });

    this.setData({
      todo_order_list: sortedTodo_order_list
    });
  },

  calculateStats: function() {
    let orders = this.data.todo_order_list;
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