var mysql = require('../../misc/mysql')
var utils = require('../../misc/utils')

module.exports = function(req, res, next) {
  let data = {
    token: '',
    message: ''
  }
  mysql.select(['users']).then(item => {
    item.forEach(sub => {
      if (sub.user_name === req.body.user_name && sub.password === req.body.password) {
        // 生成token
        // data.token = utils.getToken(sub.user_name)
        data.token = 'xiamu20185111658177'
        // 设置全局对象，便于请求验证
        // global.token.push({
        //   id: sub.user_id,
        //   token: data.token
        // })
        data.message = 'success'
        // 修改表中token
        // mysql.update(['users(token)', [data.token]], `UPDATE users SET token = "${data.token}" WHERE user_id = ${sub.user_id}`)
      } else {
        data.message = 'fail'
      }
    })
    console.log(global.token, '---global.token')
    res.send({data})
  })
}