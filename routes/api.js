var express = require('express')
var router = express.Router()
var multer = require('multer')
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
require('../misc/global.constant')()

// 身份验证
router.all(/^\/(?!login)/, require('./api/token'))

/* GET api listing. */
router.get('/account', require('./api/account'))
router.get('/measure_event', require('./api/measureEvent'))
router.get('/del_event', require('./api/delEvent'))
router.get('/event_detail', require('./api/eventDetail'))
router.get('/event_detail_all', require('./api/eventDetailAll'))
router.get('/download', require('./api/csvDownload'))

/* POST api listing. */
router.post('/login', require('./api/login'))
router.post('/upload', upload.single('file'), require('./api/upload'))

module.exports = router
