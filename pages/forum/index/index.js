// pages/forum/index/index.js
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

  getArticleList() {
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    util.request(api.ArticleList, {
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
  

  onCollectionTap:function(event){
    let that = this;
    console.log(that.data.articleList);
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.articleList[index].uuid;
    let hasCollected=this.data.articleList[index].hasCollected;
    let collectNumber =this.data.articleList[index].collectNumber; 
    console.log(uuid);
    console.log(hasCollected);
    console.log(collectNumber)
      //处理收藏
      if(!hasCollected){
        //如果当前状态是未收藏
        collectNumber++;
        hasCollected = true;
      }else{
        //如果当前状态是已收藏
        collectNumber--;
        hasCollected = false;
      }
      //更新缓存数据库
      util.request(api.CollectAddOrDelete, {
        type:0,
        valueId: uuid
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          that.data.articleList[index].hasCollected=hasCollected;
          that.data.articleList[index].collectNumber=collectNumber;
          that.setData({
            articleList:that.data.articleList,
            hasCollected:hasCollected,
            collectNumber:collectNumber
          });
        } 
        console.log(that.data.articleList);
        console.log(that.data.hasCollected);
        console.log(that.data.collectNumber);
        util.request(api.CountOperation, {
          type:'collect',
          uuid: uuid,
          Number:that.data.collectNumber
        }, 'POST').then(function(res) {
          if (res.errno === 0) {
           if(hasCollected){
            wx.showToast({
              title: '收藏成功',
              icon: 'none',
              duration: 2000
            });
           }else{
            wx.showToast({
              title: '取消收藏',
              icon: 'none',
              duration: 2000
            });
           }
          } 
        });
      });
  },

  onStarTap:function(event){
    let that = this;
    console.log(that.data.articleList);
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.articleList[index].uuid;
    let hasStar=this.data.articleList[index].hasStar;
    let starsNumber =this.data.articleList[index].starsNumber; 
      //处理点赞
      if(!hasStar){
        //如果当前状态是未点赞
        starsNumber++;
        hasStar = true;
      }else{
        //如果当前状态是已点赞
        starsNumber--;
        hasStar = false;
      }
      //更新缓存数据库
      util.request(api.StarAddOrDelete, {
        type:0,
        valueId: uuid
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          that.data.articleList[index].hasStar=hasStar;
          that.data.articleList[index].starsNumber=starsNumber;
          that.setData({
            articleList:that.data.articleList,
            hasStar:hasStar,
            starsNumber:starsNumber
          });
        } 
        util.request(api.CountOperation, {
          type:'star',
          uuid: uuid,
          Number:that.data.starsNumber
        }, 'POST').then(function(res) {
          if (res.errno === 0) {
           if(hasStar){
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 2000
            });
           }else{
            wx.showToast({
              title: '取消点赞',
              icon: 'none',
              duration: 2000
            });
           }
          } 
        });
      });
  },

  pubishArticle:function(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/forum/publishArticle/publishArticle"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getArticleList();
    console.log("onload显示-----");
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
    console.log("onshow显示-----");
    util.request(api.ArticleList, {
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
        title: '没有更多用户发帖了',
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
    //点击查看详情页面
    wx.navigateTo({
      url: '/pages/forum/articleDetail/articleDetail?uuid=' + uuid,
    });
  }
})