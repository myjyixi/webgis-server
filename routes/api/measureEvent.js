var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  let _query = req.query
  let data = {}
  let pagination = {
    total: 0,
    per_page: parseInt(_query.per_page),
    current_page: parseInt(_query.page)
  }
  mysql.select([], `SELECT COUNT(*) total FROM measuring_event`).then(result => {
    pagination.total = result[0].total
    mysql.select([], `SELECT * FROM measuring_event WHERE id >= (SELECT id FROM measuring_event LIMIT ${_query.per_page * (_query.page -1)}, 1) ORDER BY id ASC LIMIT ${_query.per_page}`).then(item => {
      data = item
      res.send({data, pagination})
    })
  })
}