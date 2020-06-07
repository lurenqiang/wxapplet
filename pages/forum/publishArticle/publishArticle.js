// pages/forum/publishArticle/publishArticle.js
var util = require('../../../utils/util.js');
var check = require('../../../utils/check.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    content: '',
    contentLength: 0,
    hasPicture: false,
    picUrls: [],
    files: [],
    accessToken:""
  },
  chooseImage: function(e) {
    if (this.data.files.length >= 5) {
      util.showErrorToast('只能上传五张图片')
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
        wx.uploadFile({
          url: api.CheckImage,
          filePath: res.tempFilePaths[0],
          name: 'file',
          //accessToken:that.data.accessToken,
          success: function(_res) {
            var _res = JSON.parse(_res.data);
            if (_res.errno === 0) {
              that.upload(res);
            }
          },
          fail: function(e) {
            util.showErrorToast(_res.errmsg);
          },
         })
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
            hasPicture: true,
            picUrls: that.data.picUrls
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
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  
  contentInput: function(e) {
    this.setData({
      contentLength: e.detail.cursor,
      content: e.detail.value,
    });
  },
  bindtitleInput:function(e){
    this.setData({
      title:e.detail.value,
    })
  },
  submitFeedback: function(e) {

    let that = this;
    if (that.data.title == "") {
      util.showErrorToast('请输入标题');
      return false;
    }
    util.request(api.CheckContent, {
      accessToken:that.data.accessToken,
      content:that.data.title,
    }, 'POST').then(function(res_) {
      if (res_.errno === 0) {  
      } else {
        util.showErrorToast(res_.errmsg);
        this.setData({
          title: '',
        });
        return false;
      }  
    });
    if (that.data.content == '') {
      util.showErrorToast('请输入内容');
      return false;
    }
    util.request(api.CheckContent, {
      accessToken:that.data.accessToken,
      content:that.data.content,
    }, 'POST').then(function(res_) {
      if (res_.errno === 0) {  
      } else {
        util.showErrorToast(res_.errmsg);
        this.setData({
          contentLength: 0,
          content: '',
        });
        return false;
      }  
    });
    wx.showLoading({
      title: '提交中...',
      mask: true,
      success: function() {
      }
    });

    util.request(api.PublishArticle, {
      title:that.data.title,
      content: that.data.content,
      hasPicture: that.data.hasPicture,
      picUrls: that.data.picUrls
    }, 'POST').then(function(res) {
      wx.hideLoading();
      if (res.errno === 0) {
        wx.showToast({
          title: '发帖成功！',
          icon: 'success',
          duration: 2000,
          complete: function() {
            that.setData({
              title:'',
              content: '',
              contentLength: 0,
              hasPicture: false,
              picUrls: [],
              files: []
            });
            wx.navigateBack({
              delta: 1
            })
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
      this.getAccessToken();
  },
//获得accesstoken
  getAccessToken:function(e){
    let that = this;
    util.request(api.AuthGetAccessToken,{},'GET').then(function(res) {
      if (res.errno === 0) {
        var accessToken = res.data.accessToken;
        that.setData({
          accessToken:accessToken,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})