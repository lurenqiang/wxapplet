// pages/forum/articleDetail/articleDetail.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    articleId:"",
    CommentList:[],
    page: 1,
    limit: 10,
    totalPages: 1,
    hasStar:false,
    hasCommented:false,
    starsNumber:0,
    commentNumber:0,
    hasonShow:false,
    theone:"",
    theoneuuid:"",
    theOneLevelCommentUuid:"",
    commentInput:"",
    wxArticle:{
      uuid:"",
      userId:"",
      userName:"", 
      userAvatar:"",
      title:"",
      content:"", 
      hasPicture:false,
      picUrls:[], 
      starsNumber:0,
      collectNumber:0,
      commentNumber:0, 
      createTime:"", 
      updateTime:"", 
      deleted:false,
      hasCollected:false,  
      hasStar:false
    }
  },
//get帖子信息
  getArticleDetail:function(e){
      let that = this;
      util.request(api.ArticleDetail, {
        articleId:that.data.articleId
      },"POST").then(function(res) {
        if (res.errno === 0) {
          that.setData({
            wxArticle:res.data.wxArticle,
            //theone:res.data.wxArticle.userName
          });
        }
      });
  },
  //get评论的相关内容
  getCommentList:function(e){
    let that = this;
    util.request(api.CommentList, {
      articleId:that.data.articleId,
      page:that.data.page
    },"POST").then(function(res) {
      if (res.errno === 0) {
        that.setData({
          CommentList:that.data.CommentList.concat(res.data.list),
          totalPages: res.data.pages,
        });
      }
    });
  },

  bindReplyNow:function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    let name = that.data.CommentList[index].userName;
    let theoneuuid = that.data.CommentList[index].userId;
    let theOneLevelCommentUuid = that.data.CommentList[index].uuid;
    that.setData({
      theone:name,
      theoneuuid:theoneuuid,
      theOneLevelCommentUuid:theOneLevelCommentUuid
    })
  },

  //comment
  submitComment:function(e){
    let that = this;
    if (that.data.commentInput == "") {
      util.showErrorToast('请输入评论内容');
      return false;
    }
    if(that.data.theone==""){
      util.request(api.AddComment, {
        articleId:that.data.articleId,
        commentInput:that.data.commentInput,
      }, 'POST').then(function(res_) {
        if (res_.errno === 0) { 
          wx.showToast({
            title: '评论成功',
          })
        } else {
          util.showErrorToast(res_.errmsg);
          this.setData({
            commentInput: '',
            theone:"",
          });
          return false;
        }  
      });
    }else{
      util.request(api.AddComment, {
        theone:that.data.theone,
        theoneuuid:that.data.theoneuuid,
        theOneLevelCommentUuid:that.data.theOneLevelCommentUuid,
        articleId:that.data.articleId,
        commentInput:that.data.commentInput,
      }, 'POST').then(function(res_) {
        if (res_.errno === 0) {  
          wx.showToast({
            title: '评论成功',
          })
        } else {
          util.showErrorToast(res_.errmsg);
          this.setData({
            commentInput: '',
            theone:""
          });
          return false;
        }  
      });
  
    }
   
  },

  bindCommentInput:function(e){
    let that =this;
    if (app.globalData.hasLogin) {
      that.setData({
        commentInput:e.detail.value,
      })
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uuid = options.uuid;
    var that = this;
    that.setData({
      articleId:uuid,
    });
    that.getArticleDetail();
    that.getCommentList();
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
  util.request(api.getArticleDetail, {
    page: that.data.page,
    articleId:that.data.articleId,
  }).then(function(res) {
    if (res.errno === 0) {
      that.setData({
        CommentList:that.data.CommentList.concat(res.data.list),
        totalPages: res.data.pages,
        theone:"",
        commentInput:""
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
      this.getCommentList();
    } else {
      wx.showToast({
        title: '没有更多回复',
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

  }
})