// pages/commentSquare/commentSquare.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    title: '',
    content: '',
    forum_post_list: []
  },

// 加载帖子数据
loadPosts: function() {
  var that = this;
  wx.request({
    url: 'http://localhost:8080/WxServlet_war_exploded/forum?requestType=square', // 替换为你的服务器地址和Servlet映射路径
    method: 'GET',
    success: function(res) {
      if (res.statusCode == 200) {
        that.setData({
          forum_post_list: res.data
        });
        that.calculateStats(); // 调用 calculateStats
      } 
      else {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    }
  });
},

togglePostPopup: function() {
  this.setData({
      showPopup: !this.data.showPopup
  });
},

inputTitle: function(e) {
  this.setData({
      title: e.detail.value
  });
},

inputContent: function(e) {
  this.setData({
      content: e.detail.value
  });
},

submitPost: function() {
  const { title, content } = this.data;
  const postTime = new Date().toISOString().replace('T', ' ').replace(/\..*$/, '');
  let userId = '520'; // 这里模拟获取到的用户OpenID，实际应通过登录流程获取
   wx.request({
    url: 'http://localhost:8080/WxServlet_war_exploded/forum?requestType=post', // 添加 requestType 参数
    method: 'POST',
    data: {
      UserId: userId,
      Title: title,
      Content: content,
      PostTime: postTime
    },
    success: function(res) {
      wx.showToast({
        title: '吐槽成功',
        icon: 'success'
      })
    }
  });
  this.togglePostPopup();
},

// 添加搜索输入内容的处理函数
inputSearch: function(e) {
  this.setData({
  searchQuery: e.detail.value
  });
  },
  
  // 添加搜索帖子的函数
  searchPosts: function() {
    var that = this;
    wx.request({
    url: 'http://localhost:8080/WxServlet_war_exploded/forum?requestType=search&query=' + this.data.searchQuery,
    method: 'GET',
    success: function(res) {
    if (res.statusCode == 200) {
    that.setData({
    forum_post_list: res.data
    });
    that.calculateStats(); // 调用 calculateStats
    } 
    else {
    wx.showToast({
    title: '搜索失败',
    icon: 'none'
    });
    }
    }
    });
  },

  // 点击帖子项时执行
  onPostClick: function(event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: './forumDetail?postId=' + postId
    });
  },
  
  sortById: function() {
    let sortedForum_post_list = this.data.forum_post_list.sort((a, b) => {
      return b.PostID - a.PostID;
    });

    this.setData({
      forum_post_list: sortedForum_post_list
    });
  },

  calculateStats: function() {
    let orders = this.data.forum_post_list;
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadPosts();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.loadPosts();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadPosts();
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