var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  let _query = req.query
  let author = req.headers.authorization
  if (_query.token) { // 登录时不经此中间件验证直接跳至/account
    // console.log(_query.token, '--next-token')
    next()
  } else {
    let _token = author ? author.split(' ')[1] : _query.token // _query.token用于测试请求
    let index = 0
    global.token.forEach(item => {
      if (item.id === parseInt(_query.user_id) && item.token === _token) {
        index ++
        // 不要进两次该判断，不然爆炸。。
        next()
      }
    })
    if (!index) {
      res.status(401).send(global.unauthError)
    }
  }
}