// pages/ucenter/inBox/inBox.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unReadNoticeList:[],
    hasReadNoticeList:[]
  },

  getInboxNotice(){
    let that= this;
    util.request(api.GetInboxNotice, {
      type:3,
    }, 'POST').then(function(res){
      if(res.errno==0){
        that.setData({
          unReadNoticeList:res.data.unReadNoticeList,
          hasReadNoticeList:res.data.hasReadNoticeList
        })
        that.getread();
      }
    })
  },

  getread(){
    //批量阅读
    util.request(api.GetReadInboxNotice, {
      type:3,
    }, 'POST').then(function(res){
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
    this.getInboxNotice();
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