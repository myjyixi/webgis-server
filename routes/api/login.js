var mysql = require('../../misc/mysql')
var utils = require('../../misc/utils')

module.exports = function(req, res, next) {
  let _body = req.body
  let data = {
    token: '',
    message: ''
  }
  let index = 0
  mysql.select(['users']).then(item => {
    item.forEach(sub => {
      if (sub.user_name === _body.user_name && sub.password === _body.password) {
        index ++
        // 生成token
        data.token = utils.getToken(sub.user_name)
        // data.token = 'xiamu20185111658177'
        // 设置session对象，便于请求验证
        if (!req.session.userData || req.session.userData.length == 0) { // 无用户登录信息字段
          req.session.userData = []
          req.session.userData.push({id: sub.user_id, token: data.token})
        } else { // 有用户登录信息字段
          // req.session.userData.forEach(item => {
          //   if (!item || item.id !== sub.user_id) {
              req.session.userData.push({id: sub.user_id, token: data.token})
          //   }
          // })
        }
        // global.token.push({
        //   id: sub.user_id,
        //   token: data.token
        // })
        console.log(req.session)
        data.message = 'success'
      }
    })
    // 无此用户
    if (!index) {
      data.message = 'fail'
    }
    res.send({data})
  })
}