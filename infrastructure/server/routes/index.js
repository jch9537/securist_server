//리소스 라우터
const express = require('express');
const router = express.Router();

require('./auth')(router);
require('./user')(router);
require('./company')(router);
require('./relation')(router);
require('./profile')(router);
// require('./test');

module.exports = router;
