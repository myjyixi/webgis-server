var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  let _query = req.query
  let data = {
    event_id: _query.id,
    detail: []
  }
  // 查询事件详情
  mysql.select([], `SELECT * FROM measuring_point WHERE event_id = ${_query.id} ORDER BY id ASC`).then(item => {
    data.detail = item
    res.send({data})
  })
}