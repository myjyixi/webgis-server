let mysql = require('mysql') //导入mysql模块

var connection = mysql.createConnection({ //配置连接参数
  host: 'localhost',
  user: 'root',
  password: 'MYJET1314',
  database: 'gis'
})

connection.connect() //连接

/**
 * 增
 * @param {String} table 表-user(user_id, user_name)
 * @param {Array} value 插入值-[[1, 'myj'], [2, 'y']]
 * @param {String} sql SQL
 */
exports.insert = function([table, value], sql) {
  console.log('                --mysql.index', global.index++)
  return new Promise((resolve, reject) => {
    connection.query(sql ? sql : (`INSERT INTO ${table} VALUES ?;`, value), (err, results, fields) => {
      if (err) {
        console.log('[INSERT ERROR] '+ err.message)
        reject('[INSERT ERROR] '+ err.message)
      } else {
        resolve(results)
      }
    })
  })
}

/**
 * 删
 * @param {String} table 表
 * @param {String} index 索引-user_id = ?
 * @param {String} sql SQL
 */
exports.delete = function([table, index], sql) {
  console.log('                --mysql.index', global.index++)
  return new Promise((resolve, reject) => {
    connection.query(sql ? sql : `DELETE FROM ${table} where ${index}`, (err, results, fields) => {
      if (err) {
        console.log('[DELETE ERROR] '+ err.message)
        reject('[DELETE ERROR] '+ err.message)
      } else {
        resolve('success')
      }
    })
  })
}

/**
 * 改
 * @param {String} table 表
 * @param {String} key 修改位置-user_name = ?, password = ?
 * @param {String} index 索引-user_id = ? 
 * @param {Array} value 修改值-[['myj', '123456', 10086], ['name', 'password', 1234]]
 * @param {String} sql SQL
 */
exports.update = function([table, key, index, value], sql) {
  console.log('                --mysql.index', global.index++)
  return new Promise((resolve, reject) => {
    connection.query(sql ? sql : (`UPDATE ${table} SET ${key} WHERE ${index}`, value), (err, results, fields) => {
      if (err) {
        console.log('[UPDATE ERROR] '+ err.message)
        reject('[UPDATE ERROR] '+ err.message)
      } else {
        resolve(results)
      }
    })
  })
}

/**
 * 查
 * @param {String} table 查询表
 * @param {String} line 查询列
 * @param {String} sql 查询SQL
 */
exports.select = function([table, line = '*'], sql) {
  console.log('                --mysql.index', global.index++)
  return new Promise((resolve, reject) => {
    connection.query(sql ? sql : `SELECT ${line} FROM ${table};`, (err, results, fields) => {
      if (err) {
        console.log('[SELECT ERROR] '+ err.message)
        reject('[SELECT ERROR] '+ err.message)
      } else {
        console.log(results, '--sql-else')
        resolve(results)
      }
    })
  })
}
