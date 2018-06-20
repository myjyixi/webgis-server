var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  let _query = req.query
  let data = {
    event: [],
    detail: []
  }
  let pagination = {
    total: 0,
    per_page: parseInt(_query.per_page),
    current_page: parseInt(_query.page)
  }
  // 查询事件详情总页数
  mysql.select([], `SELECT COUNT(*) total FROM measuring_point WHERE event_id = ${_query.id}`).then(result => {
    pagination.total = result[0].total
    // 查询事件信息
    mysql.select([], `SELECT * FROM measuring_event WHERE id = ${_query.id}`).then(eventData => {
      data.event = eventData
      // 查询事件详情分页
      mysql.select([], `SELECT * FROM measuring_point WHERE event_id = ${_query.id} ORDER BY id ASC LIMIT ${_query.per_page * (_query.page -1)}, ${_query.per_page}`).then(item => {
        data.detail = item
        res.send({data, pagination})
      })
    })
  })
}