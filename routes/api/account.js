var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  // let ret = {
  //   data: {
  //     user_id: '',
  //     user_name: ''
  //   }
  // }
  // // console.log('           --account.index', global.index++)
  // let index = 0
  // global.token.forEach(item => {
  //   // console.log('           --account-foreach', global.index++)
  //   console.log(item.token, req.query.token, '--account-token')
  //   if (item.token === req.query.token) {
  //     index ++
  //     // console.log('           --account-in-foreach', global.index++)
  //     // 查询用户数据
  //     mysql.select([], `SELECT * FROM users WHERE user_id = ${item.id}`).then(data => {
  //       // console.log('           --account-in-foreach-select', global.index++)
  //       ret.data.user_id = data[0].user_id
  //       ret.data.user_name = data[0].user_name
  //       res.send(ret)
  //     })
  //   }
  // })
  // if (!index) {
  //   res.sendStatus(401)
  // }

  let data = {
    user_id: '',
    user_name: ''
  }
  let userId, index = 0

  if (req.query.user_id) {
    userId = req.query.user_id
  } else if (req.query.token) {
    global.token.forEach(item => {
      if (item.token === req.query.token) {
        index ++
        userId = item.id
      }
    })
    if (!index) {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(401)
  }
  mysql.select([], `SELECT * FROM users WHERE user_id = ${userId}`).then(item => {
    data.user_id = item[0].user_id
    data.user_name = item[0].user_name
    res.send({data})
  })
}