// pages/ucenter/myLifeService/myLifeService.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrls: [],
    hasPicture: false,
    files:[],
    faceGrades:['人脸注册','人脸更新','人脸注销'],
    payGrades:['月卡缴费','物业缴费','年度账单'],
    selectedface: false,
    selectedpay:false
  },

  // 点击下拉框 
  bindShowMsg() {
    this.setData({
      selectedface: !this.data.selectedface
    })
  },
  bindShowPayMsg(){
    this.setData({
      selectedpay: !this.data.selectedpay
    })
  },

  manageFaceSelect:function(e){
    let that = this;
    var method = e.currentTarget.dataset.name;
    if(method == '人脸注册'){
      util.request(api.CheckFaceRecognition, {
      }, 'GET').then(function(res) {
        if(res.errno==0){
          if(res.data.hasFace==true){
            wx.showModal({
              cancelColor: 'cancelColor',
              title: '已经进行过人脸注册',
            })
          }else{
            that.chooseImage();
            //that.submitPermission();
          }
        }
      })
    }else if(method=="人脸更新"){
      util.request(api.CheckFaceRecognition, {
      }, 'GET').then(function(res) {
        if(res.errno==0){
          if(res.data.hasFace==false){
            wx.showModal({
              cancelColor: 'cancelColor',
              title: '请先进行过人脸注册',
            })
          }else{
            that.chooseImage();
          }
        }
      })  
    }else if(method=="人脸注销"){
      util.request(api.DeleteFaceRecognition, {
      }, 'GET').then(function(res) {
          if(res.errno==0){
            wx.showToast({
              title: '人脸注销成功!',
            })
            that.setData({
              selectedface:false
            })
          }else{
            wx.showModal({
              cancelColor: 'cancelColor',
              title: res.errmsg,
            })
          }
      })
    }
  },

  chooseImage(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        that.upload(res);
      }
    })
  },
  upload: function(res) {
    var that = this;
    const uploadTask = wx.uploadFile({
      url: api.StorageUpload,
      filePath: res.tempFilePaths[0],
      name: 'file',
      success: function(res) {
        var _res = JSON.parse(res.data);
        if (_res.errno === 0) {
          var url = _res.data.url
          that.data.picUrls.push(url)
          that.setData({
            picUrls: that.data.picUrls,
            hasPicture: true,
            files: [],
          })
          that.submitPermission();
        }
      },
      fail: function(e) {
        wx.showModal({
          title: '错误',
          content: '上传失败',
          showCancel: false
        })
      },
    })

    uploadTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })

  },

  submitPermission() {
    let that = this;
    console.log("12")
    util.request(api.FaceRecognitionAdd, {
      picUrls: that.data.picUrls
    }, 'POST').then(function(res) {
      wx.hideLoading();
      if (res.errno === 0) {
        wx.showToast({
          title: '申请人脸开门成功！',
          icon: 'success',
          duration: 2000,
          complete: function() {
            that.setData({
              picUrls: [],
              hasPicture:false,
              files: [],
              selectedface:false,
            });
          }
        });
      } else {
        util.showErrorToast(res.errmsg);
      }

    });
  },

  manageTiezi:function(){
    wx.navigateTo({
      url: '/pages/forum/myarticle/myarticle',
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