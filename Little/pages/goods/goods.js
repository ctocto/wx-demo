Page({
    data: {
        goodsName: [
            "请选择",
            "生活用品",
            "办公用品",
            "食品",
            "药品",
            "电子电气",
            "建材",
            "设备",
            "矿产"
        ],
        index: 0,
        location: {
            start: '我的位置',
            end: ''
        }
    },
    bindpickerchange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    selectMapS: function () {
        let _this = this
        // let appInstance = getApp()
        // if(appInstance.globalData.weLog != 1002){
        //     appInstance.globalData.weLog = 1002
        // }
        // wx.navigateTo({
        //   url: '../indexmap/indexmap'
        // })
        wx.chooseLocation({
          success: function(res){
              _this.data.location.start = res.name
              _this.setData({
                  location: _this.data.location
              })
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
    },
    selectMapE: function() {
        let _this = this
        wx.chooseLocation({
          success: function(res){
              _this.data.location.end = res.name
              _this.setData({
                  location: _this.data.location
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