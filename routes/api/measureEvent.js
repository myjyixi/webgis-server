var mysql = require('../../misc/mysql')
// var eventData = require('./test.json')

module.exports = function(req, res, next) {
  let data = {}
  let pagination = {
    total: 123,
    per_page: 10,
    current_page: 1
  }
  // console.log(JSON.parse(eventData), '--eventData')
  // eventData.data.forEach(item => {
  //   mysql.insert([], `
  //   INSERT INTO
  //   measuring_event(event_name, site, longitude, latitude, height, g, instrument, operator)
  //   VALUES('${item.event_name}', '${item.site}', ${item.longitude}, ${item.latitude}, ${item.height}, ${item.g}, '${item.instrument}', '${item.operator}')
  //   `).then(() => {
  //     // VALUES('April 27 event', 'hangzhou', 120.0005700, 30.0000006, 20.2000000, 9.8890000, 'ZAG-', 'myj')
  //     console.log(typeof item.event_name, typeof item.site, typeof item.longitude, typeof item.latitude, typeof item.height, typeof item.g, typeof item.instrument, typeof item.operator)
  //     mysql.select(['measuring_event']).then(sub => {
  //       data = sub
  //       res.send({data, pagination})
  //     })
  //   })
  // })
  console.log('           --measure_event.index', global.index++)
  mysql.select(['measuring_event']).then(item => {
    data = item
    console.log(req.query + '---measuring_event-query')
    res.send({data, pagination})
    // console.log(data)
    // next()
  })
}