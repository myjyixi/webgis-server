var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  let _query = req.query
  let data = {}
  let pagination = {
    total: 0,
    per_page: parseInt(_query.per_page),
    current_page: parseInt(_query.page)
  }
  let searchTime
  let searchWord

  // 时间查询
  (_query.start_time || _query.end_time)
    ? searchTime = `AND (update_time BETWEEN '${_query.start_time}' AND '${_query.end_time}' OR measure_time BETWEEN '${_query.start_time}' AND '${_query.end_time}')`
    : searchTime = ''
  // 关键字查询
  _query.search ? searchWord = `AND (site = '${_query.search}' OR instrument = '${_query.search}' OR operator = '${_query.search}')` : searchWord = ''

  // 删除事件
  mysql.delete([], `DELETE FROM measuring_event where id=${_query.id}`).then(() => {
    // 查询事件列表返回
    mysql.select([], `SELECT COUNT(*) total FROM measuring_event`).then(result => {
      pagination.total = result[0].total
      mysql.select([], `
        SELECT * FROM measuring_event
        WHERE id >= (
          SELECT id FROM measuring_event LIMIT ${_query.per_page * (_query.page -1)}, 1
        )
        ${searchTime}
        ${searchWord}
        ORDER BY id ASC
        LIMIT ${_query.per_page}
      `).then(item => {
        data = item
        res.send({data, pagination})
      })
    })
  }).catch(error => {
    res.send({data: {error: error}})
  })
}