var Bmob = require('../../utils/bmob.js');
var allV = Bmob.Object.extend("allVideo");
var query = new Bmob.Query(allV);
var Users = Bmob.Object.extend("user");
var queryUsers = new Bmob.Query(Users);

//获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: null,
        videoSrc: [],
        nowPlay: -1,
        loadSkip: 10,
        dataCount: 0,
        loadMoreBtn: '没有更多...'
    },
    onReady: function () {
        let _this = this
        wx.getNetworkType({
            success: function (res) {
                let networkType = res.subtype || res.networkType
                if(networkType != 'wifi'){
                    wx.showModal({
                        title: '提示',
                        content: '非wifi网络下观看会产生大量流量费用',
                        showCancel: false
                    })
                }
                // _this.update()
            }
        })
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            _this.setData({
                userInfo: userInfo
            })
            
        })
        this.bmobScreach()
        this.loadData()
        
    },
    bmobScreach: function() {
        var _this = this
        query.count({
            success: function (count) {
                // 查询成功，返回记录数量
                console.log("共有 " + count + " 条记录");
                _this.setData({
                    dataCount: count
                })
                if(count > 10){
                    _this.setData({
                        loadMoreBtn: '加载更多...'
                    })
                }
            },
            error: function (error) {
                // 查询失败
            }
        })
    },
    loadData: function(ref) {
        let _this = this
        query.limit(10)//10条每次
        query.descending('orderId')//倒序
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
                if(ref){//刷新
                    _this.data.videoSrc = dataArray
                    _this.setData({
                        videoSrc: _this.data.videoSrc
                    })
                    wx.showToast({
                        title: '更新成功',
                        icon: 'success',
                        duration: 1500
                    })
                    wx.stopPullDownRefresh()
                }else{//正常展示
                    if(dataArray.length == 0){
                        _this.setData({
                            loadMoreBtn: '没有更多...'
                        })
                        return;
                    }
                    dataArray = _this.data.videoSrc.concat(dataArray)
                    _this.setData({
                        videoSrc: dataArray
                    })
                }

            },
            error: function (error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        })
    },
    onPullDownRefresh: function () {
        let _this = this
        this.bmobScreach()
        this.setData({
            loadSkip: 10
        })
        query.skip(0)
        _this.loadData(true)
    },
    pauseHandle: function (e) {
        // console.log(e,'pause')
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

        //浏览数更新
        this.upDateView(id, dataId)

    },
    likeHandle: function (e) {
        let _this = this
        let id = e.currentTarget.id
        let videoId = parseInt(e.currentTarget.dataset.videoid)
        let parise = parseInt(e.currentTarget.dataset.videopraie)
        let fromId = this.data.userInfo.userKey
        queryUsers.equalTo("userid", fromId)//等于条件
        queryUsers.find({
            success: function(result) {
                let item = result[0]
                if(!item) return
                let setId = item.id
                let data = item.attributes

                if(data.pariser.indexOf(id) == -1){

                    _this.setLike(id, videoId, setId, data.pariser, parise)
                }
            }
        })
        
        
    },
    setLike: function(id, videoId, setId, pariseData, parise) {
        let _this = this
        let praies = parise + 1
        this.data.videoSrc[videoId].praie = praies
        queryUsers.get(setId, {
            success: function (res) {
                pariseData.push(id)
                res.set('pariser', pariseData)
                res.save()
                _this.setData({
                    videoSrc: _this.data.videoSrc
                })
                query.get(id, {
                    success: function (result) {
                        result.set('praie', praies)
                        result.save()
                    }
                })
            },
            error: function (object, error) {
                console.log('点赞失败',object,error)
            }
        })
    },
    upDateView: function (id, dataId) {
        //浏览数更新
        let _this = this
        this.data.videoSrc[id].view += 1
        this.setData({
            videoSrc: this.data.videoSrc
        })
        query.get(dataId, {
            success: function (result) {
                result.set('view', _this.data.videoSrc[id].view)
                result.save()
            },
            error: function () {

            }
        })
    },
    loadMore: function () {
        if (this.data.dataCount <= 10) return;
        let loadSkip = this.data.loadSkip
        query.skip(loadSkip)
        this.loadData()
        this.setData({
            loadSkip: loadSkip + 10
        })
    },
    avatarTap: function(e) {
        let visitor = e.currentTarget.dataset.visitorid
        app.globalData.visitor = visitor
        wx.navigateTo({
          url: '../info/info'
        })
    },
    downloadHandle: function(e) {
        let downloadUrl = e.currentTarget.dataset.downloadurl
        wx.downloadFile({
          url: downloadUrl,
          type: 'video', 
          success: function(res){
            wx.showToast({
                title: '下载成功',
                icon: 'success'
            })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    }
})