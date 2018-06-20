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
    ? searchTime = `(update_time BETWEEN '${_query.start_time}' AND '${_query.end_time}' OR measure_time BETWEEN '${_query.start_time}' AND '${_query.end_time}')`
    : searchTime = ''
  // 关键字查询
  _query.search
    ? searchWord = `(site = '${_query.search}' OR instrument = '${_query.search}' OR operator = '${_query.search}')`
    : searchWord = ''

  // 查询搜索总条数
  mysql.select([], `
    SELECT COUNT(*) total FROM measuring_event
    ${(searchTime ? 'WHERE ' : '') + searchTime}
    ${(searchWord ? searchTime ? 'AND ' : 'WHERE ' : '') + searchWord}
  `).then(result => {
    pagination.total = result[0].total
    // 查询搜索分页
    mysql.select([], `
      SELECT * FROM measuring_event
      WHERE id >= (
        SELECT id FROM measuring_event LIMIT ${_query.per_page * (_query.page -1)}, 1
      )
      ${(searchTime ? 'AND' : '') + searchTime}
      ${(searchWord ? 'AND' : '') + searchWord}
      ORDER BY id ASC
      LIMIT ${_query.per_page}
    `).then(item => {
      data = item
      res.send({data, pagination})
    })
  })
}