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
    files:[]
  },

  chooseImage: function(e) {
    if (this.data.files.length >= 1) {
      util.showErrorToast('只能上传1张图片')
      return false;
    }

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

  submitPermission: function(e) {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }

    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo.userStatus==1){
      wx.showToast({
        title: '必须为本小区居民!',
      })
      return false;
    }
    if(that.data.hasPicture==false){
      wx.showToast({
        title: '需要上传一张人脸照片!',
      })
      return false;
    }
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
            });
          }
        });
      } else {
        util.showErrorToast(res.errmsg);
      }

    });
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