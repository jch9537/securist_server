//리소스 라우터
const express = require('express');
const router = express.Router();

require('./serviceAuth')(router);
require('./auth')(router);
require('./user')(router);
require('./company')(router);
require('./profile')(router);

module.exports = router;
