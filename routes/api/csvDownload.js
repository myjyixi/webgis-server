var csv =require('csv')
var mysql = require('../../misc/mysql')

module.exports = function(req, res, next) {
  let _query = req.query
  // 查询事件详情
  mysql.select([], `SELECT * FROM measuring_point WHERE event_id = ${_query.id} ORDER BY id ASC`).then(item => {
    console.log(item)
    // 返回csv格式数据
    csv.stringify(item, { header: true }).pipe(res)
  })
}