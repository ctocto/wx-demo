Page({
    data: {
        inputValue: '',
        verityTxt: '获取验证码'
    },
    submitHandle: function () {
        wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
        })
        
        setTimeout(()=>{
            let appInstance = getApp()
            appInstance.globalData.weLog = 1001
            wx.redirectTo({
                url: "../indexmap/indexmap"
            })
        },2000)
        
    },
    bindChange: function (e) {
        this.setData({inputValue: e.detail.value})
    },
    getVerify: function () {
        let _this = this;
        let timer = null;
        new Promise((resolve, reject)=>{
            this.checkInput(this.data.inputValue,resolve, reject)
        }).then((res)=>{
            timer = setInterval(()=>{
                this.setData({verityTxt:--res})
                if(res < 0){
                    clearInterval(timer)
                    this.setData({verityTxt:'重新获取'})
                }
            },1000)
        },
        (res)=>{
            wx.showModal({
                title: '错误提示',
                content: res,
                showCancel: false,
                success: function(res) {
                    _this.setData({inputValue: ''})
                }
            })
        })
            

    },
    checkInput: function (val,resolve, reject) {
        let reg = !!val.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)
        if(val.length == 0){
            reject('请输入手机号码')
        }else if(reg == false){
            reject('手机号码输入有误')
        }else{
            resolve(60)
        }
    }
})