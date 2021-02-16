//리소스 라우터
const express = require('express');
const router = express.Router();

require('./user')(router);
require('./project')(router);

module.exports = router;
