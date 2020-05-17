// 以下是业务服务器API地址
// 本机开发时使用
var WxApiRoot = 'http://localhost:8080/wx/';
// 局域网测试使用
//var WxApiRoot = 'http://192.168.1.3:8080/wx/';
// 云平台部署时使用
// var WxApiRoot = 'http://122.51.199.160:8080/wx/';
// 云平台上线时使用
// var WxApiRoot = 'https://www.menethil.com.cn/wx/';

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
  
  UserIndex: WxApiRoot + 'user/index', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息
};