// pages/ucenter/personalInfomation/updateInfo/updateInfo.js
var api = require('../../../../config/api.js');
var util = require('../../../../utils/util.js');
var user = require('../../../../utils/user.js');

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasPicture: false,
    picUrls: [],
    files: []
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
  switchChange:function(e) {
    if (e.detail.value) {
      this.setData({ sex: '男' });
    } else {
      this.setData({ sex: '女' });
    }
  },
  switchChange1:function(e) {
    if (e.detail.value) {
      this.setData({ userStatus: '游客' });
    } else {
      this.setData({ userStatus: '小区居民' });
    }
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
   this.setData({
     dates: e.detail.value
   })
 },

 //更换图像
 changeAvatar:function(){
  const _this = this;
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePath = res.tempFilePaths[0];
      _this.setData({
        appletAvatar: tempFilePath
      })
      _this.upload(res);     
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
//获取用户的登录信息
if (app.globalData.hasLogin) {
  let userInfo = wx.getStorageSync('userInfo');
  let sex;
  let userStatus;
  let isDisabled;
  let dates = userInfo.birthday;
  let appletAvatar = userInfo.appletAvatar;
  if(userInfo.gender == 1){
     sex ='男';
  }else{
    sex ='女';
  }
  if(userInfo.userStatus == 1){
    userStatus ='游客';
 }else if(userInfo.userStatus == 0){
    userStatus ='小区居民';
    isDisabled = true;
 }
 if(userInfo.birthday==null){
   dates=util.formatDate(new Date());
 }
  this.setData({
    userInfo: userInfo,
    hasLogin: true,
    sex: sex,
    userStatus:userStatus,
    isDisabled:isDisabled,
    dates:dates,
    appletAvatar:appletAvatar
  });
}  
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
  updateDetail:function(e){
    let userInfo = wx.getStorageSync('userInfo');
    userInfo.appletAvatar = this.data.appletAvatar;
    userInfo.birthday = this.data.dates;
    if(this.data.sex=='男'){
      userInfo.gender = 1;
    }else if(this.data.sex=='女'){
      userInfo.gender = 2;
    }
    if(this.data.userStatus=='游客'){
      userInfo.userStatus = 1;
    }else if(this.data.userStatus=='小区居民'){
      userInfo.userStatus = 0;
    }
    if(this.data.realname!=null){
      userInfo.realname =this.data.realname;
    }
    if(this.data.address!=null){
      userInfo.address = this.data.address;
    }
    if(this.data.nickname!=null){
      userInfo.nickname = this.data.nickname;
    }
    console.log(userInfo);
    let that = this;
    wx.showLoading({
      title: '提交中...',
      mask: true,
      success: function() {
      }
    });
    util.request(api.AuthUpdateDetail, {
      userInfo:userInfo,
      picUrls: that.data.picUrls
    }, 'POST').then(function(res) {
      wx.hideLoading();
      if (res.errno === 0) {
        wx.setStorageSync('userInfo', userInfo);
        wx.showToast({
          title: '恭喜你更新成功！',
          icon: 'success',
          duration: 2000,
          complete: function() {
            that.setData({
              hasPicture: false,
              picUrls: [],
              files: [],
            });
          }
        });
      } else {
        util.showErrorToast(res.errmsg);
      }
    });
  },
  getnickName:function(e){
    this.setData({
      nickname: e.detail.value
    })
  },
  getrealName:function(e){
    this.setData({
      realname: e.detail.value
    })
  },
  getaddress:function(e){
    this.setData({
      address: e.detail.value
    })
  }
})