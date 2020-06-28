// pages/ucenter/index/index.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../utils/user.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: '点击登录',
      appletAvatar: '/images/my.png'
    },
    notReadNotice: {
      notifyNotRead: 0,
      inBoxNotRead: 0,
      reflectComment: 0
    },
    hasLogin: false
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
//获取用户的登录信息
if (app.globalData.hasLogin) {
  let userInfo = wx.getStorageSync('userInfo');
  this.setData({
    userInfo: userInfo,
    hasLogin: true
  });

  let that = this;
  util.request(api.UserNotify).then(function(res) {
    if (res.errno === 0) {
      that.setData({
        notReadNotice: res.data.notReadNotice
      });
    }
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

  }
  ,
  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    }
  },
  goImportantNotice(){
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/importantNotice/importantNotice"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goinBox(){
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/inBox/inBox"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goReflectComment(){
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/reflectComment/reflectComment"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goReflectProblem() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/service/reflectProblem/reflectProblem"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goPermission(){
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/getPermission/getPermission"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goCoupon() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/couponList/couponList"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goLifeService() {
    if (this.data.hasLogin) {
      if(wx.getStorageSync('userInfo').userStatus !=1 && wx.getStorageSync('userInfo').status==0){
        wx.navigateTo({
          url: "/pages/ucenter/myLifeService/myLifeService"
        });
      }else{
        wx.showModal({
          cancelColor: 'cancelColor',
          title:'请确保您为小区居民且账号可用!'
        })
      }
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goCollect() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/collect/collect"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goFeedback(e) {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/feedback/feedback"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goFootprint() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/footprint/footprint"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  goPersonalInfo() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/personalInfo/personalInfo"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  bindPhoneNumber: function(e) {
    if (e.detail.errMsg !== "getPhoneNumber:ok") {
      // 拒绝授权
      return;
    }

    if (!this.data.hasLogin) {
      wx.showToast({
        title: '绑定失败：请先登录',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    util.request(api.AuthBindPhone, {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }, 'POST').then(function(res) {
      if (res.errno === 0) {
        wx.showToast({
          title: '绑定手机号码成功',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  goAfterSale: function() {
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/ucenter/aftersaleList/aftersaleList"
      });
    } else {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    };
  },
  aboutUs: function() {
    wx.navigateTo({
      url: '/pages/ucenter/about/about'
    });
  },
  goHelp: function () {
    wx.navigateTo({
      url: '/pages/ucenter/help/help'
    });
  },  
  exitLogin: function() {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (!res.confirm) {
          return;
        }
        util.request(api.AuthLogout, {}, 'POST');
        app.globalData.hasLogin = false;
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        wx.reLaunch({
          url: '/pages/ucenter/index/index'
        });
      }
    })

  }
})