/*
 * @Author: xiamu
 * @Date: 2018-05-10 15:09:5
 * @Last Modified by: xiamu
 * @Last Modified time: 2018-05-10 15:20:52
 */
module.exports = {
  // 生成token
  getToken(param) {
    let nowDate = new Date()
    let token = param + nowDate.getFullYear().toString() + (nowDate.getMonth() + 1).toString() + nowDate.getDate().toString() + nowDate.getHours().toString() + nowDate.getMinutes().toString() + nowDate.getSeconds().toString() + nowDate.getMilliseconds().toString()
    return token
  }
}
