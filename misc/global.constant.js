module.exports = function() {

  // 设置401错误信息
  global.unauthError = {
    message: '授权失败，请稍后重试',
    status_code: 401
  }

  // 用于断点进度
  global.index = 0
}
