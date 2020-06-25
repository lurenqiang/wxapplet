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

  onStarTap:function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.CommentList[index].uuid;
    let hasStar=this.data.CommentList[index].hasStar;
    let starsNumber =this.data.CommentList[index].starsNumber; 
    let userId = this.data.CommentList[index].userId;
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
        //type:1代表是回复评论的
        type:1,
        valueId: uuid
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          that.data.CommentList[index].hasStar=hasStar;
          that.data.CommentList[index].starsNumber=starsNumber;
          that.setData({
            CommentList:that.data.CommentList,
            hasStar:hasStar,
            starsNumber:starsNumber
          });
        } 
        util.request(api.CountOperationInComment, {
          type:'star',
          uuid: uuid,
          Number:that.data.starsNumber
        }, 'POST').then(function(res) {
          if (res.errno === 0) {
           if(hasStar){
             //如果是点赞,则对数据库的notify进行处理 
              //自己对自己点赞,不做通知
              let userInfo = wx.getStorageSync('userInfo');
              if(userInfo.uuid != userId){
                util.request(api.AddNormalNotice, {
                  type:3,
                  action: 1,
                  articleId:that.data.articleId,
                  commentId:uuid,
                  userId:userId
                }, 'POST').then(function(res){
                })
              }
            wx.showToast({
              title: '点赞成功',
              icon: 'none',
              duration: 2000
            });
           }else{
             //如果是取消点赞,则对数据库的notify进行delete处理 
              //自己对自己点赞,不做通知
              let userInfo = wx.getStorageSync('userInfo');
              if(userInfo.uuid != userId){
                util.request(api.DeleteNormalNotice, {
                  commentId:uuid,
                  articleId:that.data.articleId,
                  action: 1,
                  userId:userId
                }, 'POST').then(function(res){
                })
              }
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
  bindReply1Now:function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    let rindex = event.currentTarget.dataset.rindex;
    let name = that.data.CommentList[index].replyCommentList[rindex].userName;
    let theoneuuid = that.data.CommentList[index].replyCommentList[rindex].userId;
    let theOneLevelCommentUuid = that.data.CommentList[index].uuid;
    let userInfo= wx.getStorageSync('userInfo');
     //触摸时间距离页面打开的毫秒数  
     var touchTime = that.data.touchEnd - that.data.touchStart;
     //如果按下时间大于350为长按  
     if(touchTime > 350 && theoneuuid === userInfo.uuid){
      wx.showModal({
        title: '',
        content: '确定删除评论吗？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.CommentDelete, {
              uuid: that.data.CommentList[index].replyCommentList[rindex].uuid,
              articleId:that.data.articleId,
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                 //如果是删除评论,则对数据库的notify进行delete处理 
              //自己对自己删除自己的评论,不做通知
              if( that.data.CommentList[index].replyCommentList[rindex].replyPersonId!= theoneuuid){
                util.request(api.DeleteNormalNotice, {
                  articleId:that.data.articleId,
                  commentId:theOneLevelCommentUuid,
                  replyCommentId:that.data.CommentList[index].replyCommentList[rindex].uuid,
                  action: 3,
                  userId:theoneuuid
                }, 'POST').then(function(res){
                })
              }
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getDataAgain();
              }
            });
          }
        }
      })
     }else{ 
      that.setData({
        theone:name,
        theoneuuid:theoneuuid,
        theOneLevelCommentUuid:theOneLevelCommentUuid
      })
     }
  },

  bindReplyNow:function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    let name = that.data.CommentList[index].userName;
    let theoneuuid = that.data.CommentList[index].userId;
    let theOneLevelCommentUuid = that.data.CommentList[index].uuid;
    let userInfo= wx.getStorageSync('userInfo');
     //触摸时间距离页面打开的毫秒数  
     var touchTime = that.data.touchEnd - that.data.touchStart;
     //如果按下时间大于350为长按  
     if(touchTime > 350 && theoneuuid === userInfo.uuid){
      wx.showModal({
        title: '',
        content: '确定删除评论吗？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.CommentDelete, {
              uuid: theOneLevelCommentUuid,
              articleId:that.data.articleId,
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                 //如果是删除评论,则对数据库的notify进行delete处理 
              //自己对自己删除自己的评论,不做通知
              if(userInfo.uuid != that.data.wxArticle.userId){
                util.request(api.DeleteNormalNotice, {
                  articleId:that.data.articleId,
                  commentId:that.data.CommentList[index].uuid,
                  action: 2,
                  userId:that.data.wxArticle.userId
                }, 'POST').then(function(res){
                })
              }
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.CommentList.splice(index, 1)
                that.setData({
                  CommentList: that.data.CommentList
                });
              }
            });
          }
        }
      })
     }else{ 
      that.setData({
        theone:name,
        theoneuuid:theoneuuid,
        theOneLevelCommentUuid:theOneLevelCommentUuid
      })
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

  //comment
  submitComment:function(e){
    let that = this;
    let userId= that.data.wxArticle.userId;
    let input = that.data.commentInput;
    if (that.data.commentInput == "") {
      util.showErrorToast('请输入评论内容');
      return false;
    }
    if(that.data.theone==""){
      util.request(api.AddComment, {
        articleId:that.data.articleId,
        commentInput:that.data.commentInput,
      }, 'POST').then(function(res) {
        that.setData({
          commentInput: '',
          theone:"",
        });
        if (res.errno === 0) { 
           //如果是评论,则对数据库的notify进行处理 
              //自己对自己评论,不做通知
              let userInfo = wx.getStorageSync('userInfo');
              if(userInfo.uuid != userId){
                util.request(api.AddNormalNotice, {
                  type:3,
                  action: 2,
                  content:input,
                  articleId:that.data.articleId,
                  //从返回的数据得到commentid
                  commentId:res.data.commentUuid,
                  userId:userId
                }, 'POST').then(function(res){
                })
              }
          //重新请求,为了实时刷新数据
          that.getDataAgain();
          wx.showToast({
            title: '评论成功',
          })
        } else {
          util.showErrorToast(res.errmsg);
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
      }, 'POST').then(function(res) {
        that.setData({
          commentInput: '',
          theone:""
        });
        if (res.errno === 0) {  
          //如果是评论,则对数据库的notify进行处理 
              //自己对自己评论,不做通知
              let userInfo = wx.getStorageSync('userInfo');
              if(userInfo.uuid != that.data.theoneuuid){
                util.request(api.AddNormalNotice, {
                  type:3,
                  action:3,
                  articleId:that.data.articleId,
                  content:input,
                  commentId:that.data.theOneLevelCommentUuid,
                  replyCommentId:res.data.commentUuid,
                  userId:that.data.theoneuuid
                }, 'POST').then(function(res){
                })
             }
          that.getDataAgain();
          wx.showToast({
            title: '评论成功',
          })
        } else {
          util.showErrorToast(res.errmsg);
          return false;
        }  
      });
    }
  },

  getDataAgain:function(){
    let that = this;
    util.request(api.CommentList, {
      articleId:that.data.articleId,
      page:1
    },"POST").then(function(res) {
      if (res.errno === 0) {
        that.setData({
          CommentList:  res.data.list,
          totalPages: res.data.pages,
        });
      }
    });
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
    if (app.globalData.hasLogin) {
    var uuid = options.uuid;
    var that = this;
    that.setData({
      articleId:uuid,
    });
    //浏览痕迹的添加
    that.getArticleDetail();
    that.getCommentList();
    that.addFootprint();
   }
    else{
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  addFootprint:function(){
    var that= this;
    util.request(api.FootprintAdd, {
      articleId:that.data.articleId,
    },"POST").then(function(res) {
      if (res.errno === 0) {
      }else{
        console.error("添加足迹失败")
      }
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