Page({
    data: {
        origin: {

        },
        points: {
        },
        controls: [],
        btnStatus: '../login/login'
    },
    onShow: function () {
        this.renderMap();

        let appInstance = getApp()
        let logIn = appInstance.globalData.weLog

        if(logIn == 1001){
            this.setData({btnStatus:'../selcar/selcar'})
            this.data.controls[2].iconPath = '../images/btn_bg2.png'
            this.setData({
                controls: this.data.controls
            })
        }//else if(logIn == 1002){
        //     this.setData({btnStatus:'../goods/goods'})
        // }
    },
    onReady: function(e) {
        // var _this = this;
        // wx.getLocation({
        //   type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        //   success: function(res){
        //       _this.setData({origin:{la:res.latitude,lo:res.longitude}})
        //   }
        // })
    },
    renderMap: function () {
        this.mapCtx = wx.createMapContext('carMap')
        this.getCenterLocation()
        this.ctrler()
    },
    ctrler: function () {
        let res = wx.getSystemInfoSync()
        let left = res.windowWidth / 2 - 12
        let top = res.windowHeight /2 - 33
        let controls = [{
            id: 1,
            iconPath: '../images/dingwei.png',
            position: {
                left: left,
                top: top,
                width: 25,
                height: 35
            },
            clickable: true
        },
         {
            id: 2,
            iconPath: '../images/point.png',
            position: {
                left: 20,
                top:  res.windowHeight - 70,
                width:45,
                height:45
            },
            clickable: true
        },
        {
            id: 3,
            iconPath: '../images/btn_bg1.png',
            position: {
                left: 100,
                top: res.windowHeight - 70,
                width: 250*0.4,
                height: 92*0.4
            },
            clickable: true
        }]
        this.setData({
            controls:controls
        })
    },
    getCenterLocation: function() {
        var _this = this;
        this.mapCtx.getCenterLocation({
            success: function(res) {
                _this.moveToLocation()
                _this.getMarkers(res)

            },
            fail: function(res) {
                console.log('Error:'+res)
            },
            complete: function() {
                console.log('complete')
            }
        })
    },
    getMarkers: function(res) {
   
        let la = 30.2800590000
        let lo = 120.1616930000
        let locationArr = [] 
        for(let i = 0; i < 10; i ++){
            let randA = Math.random()*0.001
            let randO = Math.random()*0.003
            la = la - randA
            lo = lo - randO
            locationArr.push({"id":"p_"+i,"latitude":la, "longitude":lo,"iconPath":"/pages/images/yellow_car.png","width":29,"height":25})
        }
        this.setData({points:locationArr})
    },
    moveToLocation: function () {
        this.mapCtx.moveToLocation()
    },
    bindViewTo: function() {
        let appInstance = getApp()
        let status = appInstance.globalData.weLog
        // if(status == 1002){
        //     wx.navigateBack({
        //         delta: 1
        //     })
        // }else{
            wx.redirectTo({
                url: this.data.btnStatus
            })
        // }
        
    },
    ctrlHandle: function (e) {
        switch(e.controlId)
        {
            case 1:
                break;
            case 2:
                this.moveToLocation();
                break;
            case 3:
                this.bindViewTo();
                break;
            default:

        }
    },
    bindregion: function (e) {
        // let appInstance = getApp()
        // let status = appInstance.globalData.weLog
        // let _this = this

        // if(e.type == 'end'){
        //     this.mapCtx.getCenterLocation({
        //         success: function(res) {
        //             if(status == 1002){
        //                 _this.setData({
        //                     topTip:res.longitude + res.latitude
        //                 })
        //             }
        //         }
        //     })
        // }
    }
})