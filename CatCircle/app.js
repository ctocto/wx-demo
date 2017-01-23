//app.js
var Bmob = require('utils/bmob.js')
Bmob.initialize("9a8bdb6a5a67ff917d6586510d4b4c37", "d085b9a87a51ef18f444302affbb8d34")
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow: function () {
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {
          that.globalData.g_code = data.code
          wx.getUserInfo({
            success: function (res) {
              that.getKey(res,cb)
              // new Promise(function (resolve, reject) {
              //   that.getKey(resolve, reject)
              // }).then(function (data) {
              //   res.userInfo.userKey = data.openid
              //   that.globalData.userInfo = res.userInfo
               
              //   typeof cb == "function" && cb(that.globalData.userInfo)
              // },function(err){

              // })

            }
          })

        }
      })
    }
  },
  getKey: function (res,cb,resolve, reject) {
    let that = this
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: 'wx69b7323645c5489f',
        secret: '66c51e004298a45c1acdd90d7a4bbe0d',
        js_code: that.globalData.g_code,
        grant_type: 'authorization_code'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (dd) {
        // resolve(res.data)
       
        res.userInfo.userKey = dd.data.openid

        that.globalData.userInfo = res.userInfo
        
        typeof cb == "function" && cb(that.globalData.userInfo)
      },
      fail: function () {
        // reject()
      }
    })
  },
  globalData: {
    userInfo: null,
    g_code: null,
    visitor: null
  }
})