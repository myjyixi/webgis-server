module.exports = function() {

  // 设置401错误信息
  global.unauthError = {
    message: '授权失败，请稍后重试',
    status_code: 401
  }

  // 设置全局对象，存储token，便于请求验证
  global.token = [{ id: 19951012, token: 'xiamu20185111658177' }]

  // 用于断点进度
  global.index = 0
}
