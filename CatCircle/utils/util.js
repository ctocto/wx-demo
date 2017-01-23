function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function randomString(length) {
  var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHKLMNOPQRSTUVWXYZ1234567890'
  var result = ''
  for(let i = 0; i < length; i++){
    let random = Math.floor(Math.random()*60)
    let s = str.substr(random, 1)
    result += s
  }
  return result
}

module.exports = {
  formatTime: formatTime,
  randomString: randomString
}
