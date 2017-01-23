var util = require('../../utils/util.js')
Page({
  data: {
    goods: [
      {
        type: "小型面包",
        load: "1吨",
        size: "1.7*1.1*1m",
        exceed: "3.0元/公里",
        price: "38",
        start: "5公里"
      },
      {
        type: "小型货车",
        load: "1.5吨",
        size: "2*1.6*1m",
        exceed: "4.0元/公里",
        price: "58",
        start: "5公里"
      },
      {
        type: "大型货车",
        load: "1.8吨",
        size: "4.2*2*1.8m",
        exceed: "5.0元/公里",
        price: "88",
        start: "5公里"
      },
      {
        type: "小型平板",
        load: "1吨",
        size: "2.6*1.6*1.9m",
        exceed: "4.0元/公里",
        price: "60",
        start: "5公里"
      },
      {
        type: "中型平板",
        load: "1.8吨",
        size: "3.6*1.9*2.3m",
        exceed: "5.0元/公里",
        price: "78",
        start: "5公里"
      },
      {
        type: "中型平板",
        load: "1吨",
        size: "4.2*1.9*2.3m",
        exceed: "6.0元/公里",
        price: "88",
        start: "5公里"
      }
    ],
    topTip: {
      before: '附近有超过',
      num: 789,
      after: '辆货车可提供服务'
    }
  },
  orderFun: function () {
    wx.navigateTo({
      url: '../goods/goods'
    })
  }
})