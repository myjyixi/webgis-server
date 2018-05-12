var express = require('express')
var router = express.Router()
// 设置全局变量
var globalCont = require('../misc/global.constant')()

router.all(/^\/(?!login)/, require('./api/token'))
// router.get(/^\/(?!login)/, require('./api/token'))
// router.post(/^\/(?!login)/, require('./api/token'))

/* GET api listing. */
router.get('/account', require('./api/account'))
router.get('/measure_event', require('./api/measureEvent'))

/* POST api listing. */
router.post('/login', require('./api/login'))

module.exports = router
