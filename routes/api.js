var express = require('express')
var router = express.Router()
var multer = require('multer')
var exec = require('child_process').exec
// 上传文件配置
var storage = multer.diskStorage({
  // 路径
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  // 文件名
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0] + '.' + Date.now() + '.' + file.originalname.split('.')[1])
  }
})
var upload = multer({ storage: storage })
// 设置全局变量
var globalCont = require('../misc/global.constant')()

router.all(/^\/(?!login)/, require('./api/token'))
// router.get(/^\/(?!login)/, require('./api/token'))
// router.post(/^\/(?!login)/, require('./api/token'))

/* GET api listing. */
router.get('/account', require('./api/account'))
router.get('/measure_event', require('./api/measureEvent'))
router.get('/event_detail', require('./api/eventDetail'))

/* POST api listing. */
router.post('/login', require('./api/login'))
router.post('/upload', upload.any('file'), require('./api/upload'))

module.exports = router
