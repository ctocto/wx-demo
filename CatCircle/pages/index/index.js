//index.js
var util = require('../../utils/util.js')
var Bmob = require('../../utils/bmob.js');
var allV = Bmob.Object.extend("allVideo");
var Users = Bmob.Object.extend("user");
var query = new Bmob.Query(allV);
var queryUsers = new Bmob.Query(Users);
//获取应用实例
var app = getApp()
Page({
  data: {
    addBtn: '添加视频',
    userInfo: {},
    videoInfo: {
      src: '',
      title: ''
    },
    ssrc: '',
    userData: [],
    loadSkip: 10,
    loadMoreBtn: '加载更多...',
    nowPlay: -1
  },
  //事件处理函数
  bindViewTap: function () {

  },
  onReady: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      that.userSet(userInfo)
      that.loadData(that.data.userInfo)
    })
    
  },
  userSet: function(userInfo) {
    let users = new Users();
    queryUsers.equalTo("userid", 'ac0a916b4c')//等于条件
      queryUsers.find({
          success: function(result) {
              if(result.length == 0){
                console.log('已存在')
              }else{
                  users.save({
                    username: userInfo.nickName,
                    userid: userInfo.userKey,
                    pariser: []
                  },{
                    success: function(result) {
                      
                    },
                    error: function(result, error) {
                      console.log('创建日记失败')
                    }
                  })
              }
          }
      })
    
  },
  loadData: function (userInfo) {
    let _this = this
    query.limit(10)//10条每次
    query.descending('orderId')//倒序
    query.equalTo("userKey", userInfo.userKey)//等于条件
    query.find({
      success: function (results) {
        let dataArray = [];
        for (let i = 0; i < results.length; i++) {
          let item = results[i]
          let obj = item.attributes
          obj.createdAt = item.createdAt
          obj.id = item.id
          dataArray.push(obj)
        }
        
        if(dataArray.length == 0){
          _this.setData({
            loadMoreBtn: '没有更多...'
          })
          return;
        }
        
        dataArray = _this.data.userData.concat(dataArray)
        _this.setData({
          userData: dataArray
        })
      },
      error: function (error) {
        console.log(error)
      }
    })
  },
  bindButtonTap: function () {
    var that = this

    if (this.data.addBtn == '发布视频') {
      if (this.data.videoInfo.title.length > 0) {
        wx.showToast({
          title: '正在添加...',
          icon: 'loading',
          duration: 10000
        })

        let tempFilePaths = []
        tempFilePaths.push(this.data.ssrc)
        let name = util.randomString(10) + '.mp4'
        let file = new Bmob.File(name, tempFilePaths)
        file.save().then(function(res){
          // console.log(res)
          that.data.videoInfo.src = res.url()
          that.setData({
            videoInfo: that.data.videoInfo
          })
          that.addDataList(res)
        },function(error){
          console.log(error);
        })
        return;
      }
      wx.showModal({
        title: '提示',
        content: '请输入标题内容',
        showCancel: false,
        success: function () {

        }
      })
    } else {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          console.log(res.tempFilePath,'格式')
          that.setData({
            ssrc: res.tempFilePath
          })
          that.setData({
            addBtn: '发布视频'
          })
        }
      })
    }

  },
  addDataList: function(res) {
    let _this = this
    let allv = new allV();
    allv.save({
      view: 0,
      userKey: this.data.userInfo.userKey,
      title: this.data.videoInfo.title,
      src: this.data.videoInfo.src,
      praie: 0,
      avatar: this.data.userInfo.avatarUrl,
      author: this.data.userInfo.nickName
    },{
      success: function(result) {
        // wx.hideToast()
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000
        })
        _this.data.userData.unshift({
          view: 0,
          userKey: _this.data.userInfo.userKey,
          title: _this.data.videoInfo.title,
          src: _this.data.videoInfo.src,
          praie: 0,
          avatar: _this.data.userInfo.avatarUrl,
          author: _this.data.userInfo.nickName
        })
        _this.setData({
          userData: _this.data.userData,
          addBtn: '添加视频',
          ssrc:'',
          videoInfo: {
            src:'',
            title:''
          }

        })
        console.log("日记创建成功, objectId:"+result.id)
      },
      error: function(result, error) {
        console.log('创建日记失败')
      }
    })
  },
  inputHandle: function (e) {
    this.setData({
      videoInfo: {
        src: this.data.ssrc,
        title: e.detail.value
      }
    })
  },
  loadMore: function () {
    let loadSkip = this.data.loadSkip
    query.skip(loadSkip)
    this.loadData(this.data.userInfo)
    this.setData({
      loadSkip: loadSkip + 10 
    })
  },
  playHandle: function (e) {
        let id = parseInt(e.currentTarget.id)
        let dataId = e.currentTarget.dataset.dataid
        let prevId = this.data.nowPlay

        let prevVideo = wx.createVideoContext(prevId.toString())
        if (id != prevId) {
            prevVideo.pause()
        }

        this.setData({
            nowPlay: id
        })

    },
})
