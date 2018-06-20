var mysql = require('../../misc/mysql')
var exec = require('child_process').exec
var utils = require('../../misc/utils')

module.exports = function(req, res, next) {
  let _body = req.body
  let file = req.file
  // 事件表插入基本信息，返回插入id
  mysql.insert([], `
    INSERT INTO 
    measuring_event(update_time, site, longitude, latitude, height, uncertainty, instrument, operator)
    VALUE('${_body.update_time}', '${_body.site}', ${_body.longitude}, ${_body.latitude}, ${_body.height}, ${_body.uncertainty}, '${_body.instrument}', '${_body.operator}')
  `).then((event) => {
    // 开启子进程，执行Python脚本
    // 解析h5文件，事件详情表插入所有数据，返回g、测量时间
    exec(`python ./py/h5treat.py --path="${file.path}" --taskgroup="${_body.task_group}" --task="${_body.task}" --db="localhost" --db_user="root" --db_passwd="MYJET1314" --event_id=${event.insertId}`,
    function(error, stdout, stderr) {
      if (error) {
        res.send('error: ' + error)
      }
      console.info('stderr : ' + stderr)
      if (stdout) {
        // Python返回的参数
        let pyOut = JSON.parse(stdout)
        // 事件表插入g、测量时间
        mysql.update([], `
          UPDATE measuring_event
          SET g=${pyOut.g}, measure_time='${utils.formatTime(pyOut.measure_time)}'
          WHERE id=${event.insertId}
        `).then(() => {
          res.send({data: {data: 'success'}})
        }).catch(error => {
          // 失败删除插入数据
          mysql.delete([], `DELETE FROM measuring_event WHERE id=${event.insertId}`)
          res.send({data: {error: error}})
        })
      } else {
        // 失败删除插入数据
        mysql.delete([], `DELETE FROM measuring_event WHERE id=${event.insertId}`)
        res.send({data: {error: 'python no stdout'}})
      }
    })
  }).catch(error => {
    // 失败删除插入数据
    mysql.delete([], `DELETE FROM measuring_event WHERE id=${event.insertId}`)
    console.log(error)
    res.send({data: {error: error}})
  })
}