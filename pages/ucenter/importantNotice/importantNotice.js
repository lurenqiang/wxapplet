// pages/ucenter/importantNotice/importantNotice.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unReadNoticeList:[],
    hasReadNoticeList:[],
  },

  getImportantNotice(){
    let that= this;
    util.request(api.GetImportantNotice, {
      type:1,
      action: 7,
    }, 'POST').then(function(res){
      if(res.errno==0){
        that.setData({
          unReadNoticeList:res.data.unReadNoticeList,
          hasReadNoticeList:res.data.hasReadNoticeList
        })
      }
    })
  },
  openDetailNotRead(event) {
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.unReadNoticeList[index].uuid;
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
            util.request(api.DeleteImportantNotice, {
              uuid: uuid
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.unReadNoticeList.splice(index, 1)
                that.setData({
                  unReadNoticeList: that.data.unReadNoticeList
                });
              }
            });
          }
        }
      })
    }else{
        //打开小文本框然后进行读后处理
        wx.showModal({
          //cancelColor: 'cancelColor',
          title:'通知',
          content:that.data.unReadNoticeList[index].content,
          success: function(res){
            if (res.confirm) {
              util.request(api.ReadImportantNotice, {
                uuid: uuid
              }, 'POST').then(function(res) {
                if (res.errno === 0) {
                  //刷新数据
                  that.getImportantNotice();
                }
              })
            }
          }
        })
    } 
  },

  openDetailHasRead(event){
    let index = event.currentTarget.dataset.index;
    let uuid = this.data.hasReadNoticeList[index].uuid;
    let that =this;
    //点击查看详情页面
     //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touchEnd - that.data.touchStart;
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '',
        content: '确定删除此重要通知吗？',
        success: function(res) {
          if (res.confirm) {
            util.request(api.DeleteImportantNotice, {
              uuid: uuid
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.data.hasReadNoticeList.splice(index, 1)
                that.setData({
                  hasReadNoticeList: that.data.hasReadNoticeList
                });
              }
            });
          }
        }
      })
    }else{
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'通知',
        content:that.data.hasReadNoticeList[index].content
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
      this.getImportantNotice();
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