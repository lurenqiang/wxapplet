// pages/ucenter/getPermission/getPermission.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
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
  getCommunityStatus:function(){
    //先查看是否申请完成,如果是小区居民则不需要再次申请
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo.userStatus != 1){
      wx.showModal({
        cancelColor: 'cancelColor',
        title:"你已经为小区居民!"
      });
    }else{
      util.request(api.CheckPermissionNotice, {
        type: 4,
        action:5
      }, 'POST').then(function(res) {
        if(res.data.hasPermissionNotice ==true){
          wx.showModal({
            cancelColor: 'cancelColor',
            title:"你已经申请了,请耐心等待管理员的核实!"
          });
        }else{
          util.request(api.AddPermissionNotice, {
            type: 4,
            action:5
          }, 'POST').then(function(res) {
            if(res.errno === 0){
              wx.showModal({
                cancelColor: 'cancelColor',
                title:"申请成功,等待管理人员审核,!"
              });
            }
          })
        }
      })
    } 
  },
  getFaceRecognition:function(){
    //先查看是否申请完成,如果是申请过则不需要再次申请
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo.userStatus == 2){
      wx.navigateTo({
        url: '/pages/service/faceRecognition/faceRecognition',
      })
    }else if(userInfo.userStatus == 1){
      wx.showModal({
        cancelColor: 'cancelColor',
        title:"必须为小区居民才可申请!"
      });
    }else{
      util.request(api.CheckPermissionNotice, {
        type: 4,
        action:6
      }, 'POST').then(function(res) {
        if(res.data.hasPermissionNotice ==true){
          wx.showModal({
            cancelColor: 'cancelColor',
            title:"你已经申请了,请耐心等待管理员的核实!"
          });
        }else{
          util.request(api.AddPermissionNotice, {
            type: 4,
            action:6
          }, 'POST').then(function(res) {
            if(res.errno === 0){
              wx.showModal({
                cancelColor: 'cancelColor',
                title:"申请成功,等待管理人员审核,!"
              });
            }
          })
        }
      })
    } 
  }
})