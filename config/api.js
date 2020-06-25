// 以下是业务服务器API地址
// 本机开发时使用
//var WxApiRoot = 'http://localhost:8978/wx/';
// 局域网测试使用
var WxApiRoot = 'http://192.168.0.107:8978/wx/';


module.exports = {
  IndexUrl: WxApiRoot + 'home/index', //首页数据接口
  AboutUrl: WxApiRoot + 'home/about', //介绍信息

  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthLogout: WxApiRoot + 'auth/logout', //账号登出
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置
  AuthResetPhone: WxApiRoot + 'auth/resetPhone', //账号密码重置
  AuthRegisterCaptcha: WxApiRoot + 'auth/regCaptcha', //验证码
  AuthBindPhone: WxApiRoot + 'auth/bindPhone', //绑定微信手机号
  AuthUpdateDetail: WxApiRoot+'auth/profile',//更新个人信息
  AuthGetInfo: WxApiRoot+'auth/getinfo',//更新个人信息
  AuthGetAccessToken: WxApiRoot+'auth/getAccessToken',//得到个人accessToken
  
  UserNotify: WxApiRoot + 'notify/notifyNotReadCount', //个人页面用户相关信息
  IssueList: WxApiRoot + 'issue/list', //帮助信息
  
  FeedbackAdd: WxApiRoot + 'feedback/submit', //添加反馈
  StorageUpload: WxApiRoot + 'storage/upload', //图片上传

  CouponList: WxApiRoot + 'coupon/list', //福利券列表
  CouponMyList: WxApiRoot + 'coupon/mylist', //我的福利券列表
  CouponReceive: WxApiRoot + 'coupon/receive', //福利券领取
  CouponExchange: WxApiRoot + 'coupon/exchange', //福利券兑换
  CouponConsume: WxApiRoot + 'coupon/consume', //消费福利券

  CollectList: WxApiRoot + 'collect/list', //收藏列表
  CollectAddOrDelete: WxApiRoot + 'collect/addordelete', //添加或取消收藏

  FootprintList: WxApiRoot + 'footprint/list', //足迹列表
  FootprintDelete: WxApiRoot + 'footprint/delete', //删除足迹
  FootprintAdd: WxApiRoot + 'footprint/add', //新增足迹

  ArticleList:WxApiRoot + 'forum/articleList', //文章列表
  ArticleDetail:WxApiRoot + 'forum/articleDetail', //帖子详细信息
  
  CommentList:WxApiRoot + 'comment/articleDetailComment', //帖子回复的相关信息
  AddComment:WxApiRoot + 'comment/addComment', //添加回复的相关信息
  CommentDelete:WxApiRoot + 'comment/deleteComment', //删除回复
  CountOperationInComment:WxApiRoot + 'comment/countOperation', //评论回复数量的改变

  PublishArticle:WxApiRoot + 'forum/publishArticle', //发帖
  CountOperation:WxApiRoot + 'forum/countOperation',//文章的点赞或者收藏的数量的改变
  CheckImage:WxApiRoot + 'forum/checkImage',//监察发帖的图片是否包含非法信息
  CheckContent:WxApiRoot + 'forum/checkContent',//监察发帖的内容是否包含非法信息

  StarAddOrDelete:WxApiRoot + 'star/addordelete', //添加或取消点赞

  ReflectProblem:WxApiRoot + 'reflect/addreflectProblem', //反映问题
  FaceRecognitionAdd:WxApiRoot + 'face/addFace', //注册脸部识别

  AddNormalNotice:WxApiRoot + 'notify/normalAddNotice', //添加普通人的通知
  DeleteNormalNotice:WxApiRoot + 'notify/normalDeleteNotice', //添加普通人的通知
};