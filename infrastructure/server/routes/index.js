const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const myRouter = require('./my');
const filesRouter = require('./files');
const niceRouter = require('./nice');
const settingsRouter = require('./settings');
const servicesRouter = require('./services');
// const companyRouter = require('./company');
// const usersRouter = require('./users');
// const profileRouter = require('./profile');

//리소스 라우터
router.use('/auth', authRouter);
router.use('/my', myRouter);
router.use('/files', filesRouter);
router.use('/nice', niceRouter);
router.use('/settings', settingsRouter); // 어드민 설정 정보
router.use('/services', servicesRouter);
// router.use('/company', companyRouter);
// router.use('/users', usersRouter);
// router.use('/profile', profileRouter);

module.exports = router;

// require('./serviceAuth')(router);
// require('./auth')(router);
// require('./user')(router);
// require('./company')(router);
// require('./profile')(router);
