// pages/forum/myarticle/myarticle.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleList: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    hasCollected:false,
    hasStar:false,
    hasCommented:false,
    collectNumber:0,
    starsNumber:0,
    commentNumber:0,
    hasonShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyArticleList();
  },
  getMyArticleList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.MyArticleList, {
      page: that.data.page,
      limit: that.data.limit
    }).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          articleList: that.data.articleList.concat(res.data.list),
          totalPages: res.data.pages,
        });
      }
      wx.hideLoading();
    });
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
    let that = this;
    //解决只显示一次onShow的问题,避免重复加载
    if(!that.hasonShow){
      that.hasonShow = true;
      return
    }
  util.request(api.MyArticleList, {
    page: that.data.page,
    limit: that.data.limit
  }).then(function(res) {
    if (res.errno === 0) {
      that.setData({
        articleList: res.data.list,
        totalPages: res.data.pages,
      });
    }
  });
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
    if (this.data.totalPages > this.data.page) {
      this.setData({
        page: this.data.page + 1
      });
      this.getCollectList();
    } else {
      wx.showToast({
        title: '没有更多帖子了',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openDetail(event) {
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.articleList[index].uuid;
    let that =this;
    //点击查看详情页面
     //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touchEnd - that.data.touchStart;
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除帖子吗？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.DeleteArticle, {
              uuid: uuid
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                //删除帖子后对所有的足迹和收藏进行删除.
                util.request(api.DeleteCollectList, {
                  type: 0,
                  valueId: uuid
                }, 'POST').then(function(res){});

                util.request(api.DeleteFootprintList, {
                  valueId: uuid
                }, 'POST').then(function(res){});


                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.articleList.splice(index, 1)
                that.setData({
                  articleList: that.data.articleList
                });
              }
            });
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/forum/articleDetail/articleDetail?uuid=' + uuid,
      });
    } 
  },
  //按下事件开始  
  touchStart: function(e) {
    let that = this;
    that.setData({
      touchStart: e.timeStamp
    })
  },
  //按下事件结束  
  touchEnd: function(e) {
    let that = this;
    that.setData({
      touchEnd: e.timeStamp
    })
  },
})