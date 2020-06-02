// 以下是业务服务器API地址
// 本机开发时使用
//var WxApiRoot = 'http://localhost:8978/wx/';
// 局域网测试使用
var WxApiRoot = 'http://192.168.0.109:8978/wx/';


module.exports = {
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  AboutUrl: WxApiRoot + 'home/about', //介绍信息

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  AuthUpdateDetail: WxApiRoot+'auth/profile',//更新个人信息
  AuthGetInfo: WxApiRoot+'auth/getinfo',//更新个人信息

  
  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息
  
  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  StorageUpload: WxApiRoot + 'storage/upload', //图片上传

  CouponList: WxApiRoot + 'coupon/list', //福利券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的福利券列表
  //CouponSelectList: WxApiRoot + 'coupon/selectlist', //当前订单可用福利券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //福利券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //福利券兑换
  CouponConsume: WxApiRoot + 'coupon/consume', //消费福利券

  CollectList: WxApiRoot + 'collect/list', //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏

  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹
};