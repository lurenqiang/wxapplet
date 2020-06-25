// pages/service/index/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  },

  reflectProblem:function(){
    if (app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/service/reflectProblem/reflectProblem"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },

  openDoor:function(){
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      if(userInfo.userStatus==1){
        wx.showModal({
          cancelColor: 'cancelColor',
          title:"不是本小区居民,请修改个人信息为小区居民,等待管理人员审核"
        })
      }else{
        //向后台请求开门服务
        wx.showToast({
          title: '开门成功',
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  }
})