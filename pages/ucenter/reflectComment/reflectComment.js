// pages/ucenter/reflectComment/reflectComment.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unCommentWxReflectProblemList:[],
    hasCommentWxReflectProblemList:[],
    hasComment:false,
    commentInput:'',
    uuid:''
  },

  getCommentList:function(){
    let that= this;
    util.request(api.GetReflectProblemList, {
    }, 'GET').then(function(res){
      if(res.errno==0){
        that.setData({
          unCommentWxReflectProblemList:res.data.unCommentWxReflectProblemList,
          hasCommentWxReflectProblemList:res.data.hasCommentWxReflectProblemList
        })
      }
    })
  },
  getCommentstatus:function(event)
  {
    let that = this;
    let index = event.currentTarget.dataset.index;
    console.log(that.data.unCommentWxReflectProblemList[index])
    let uuid = that.data.unCommentWxReflectProblemList[index].uuid;
    that.setData({
      hasComment:true,
      uuid:uuid
    })
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
  openDetailNotRead(event) {
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.unCommentWxReflectProblemList[index].uuid;
    let that =this;
    //点击查看详情页面
     //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touchEnd - that.data.touchStart;
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除此未读重要通知吗？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.DeleteReflectProblem, {
              uuid: uuid
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.unCommentWxReflectProblemList.splice(index, 1)
                that.setData({
                  unCommentWxReflectProblemList: that.data.unCommentWxReflectProblemList
                });
              }
            });
          }
        }
      })
    }
  },

  openDetailHasRead(event){
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.hasCommentWxReflectProblemList[index].uuid;
    let that =this;
    //点击查看详情页面
     //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touchEnd - that.data.touchStart;
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除此保修单吗？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.DeleteReflectProblem, {
              uuid: uuid
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.hasCommentWxReflectProblemList.splice(index, 1)
                that.setData({
                  hasCommentWxReflectProblemList: that.data.hasCommentWxReflectProblemList
                });
              }
            });
          }
        }
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
    let uuid= that.data.uuid;
    let commentInput = that.data.commentInput;
    if (that.data.commentInput == "") {
      util.showErrorToast('请输入评论内容');
      return false;
    }
    util.request(api.AddReflectProblemComment, {
      uuid: uuid,
      comment:commentInput
    }, 'POST').then(function(res) {
      if(res.errno==0){
        that.setData({
          hasComment:false,
          commentInput:""
        })
        wx.showToast({
          title: '评价成功',
        })
        //notify处理一下给管理员
        util.request(api.AddNormalNotice, {
          type:2,
          action:8,
          content:commentInput,
          senderType:2,
          userId: "superAdmin"
        }, 'POST').then(function(res){
        })
        that.getCommentList();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      this.getCommentList();
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