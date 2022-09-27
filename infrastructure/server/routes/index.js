const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const myRouter = require('./my');
const filesRouter = require('./files');
const niceRouter = require('./nice');
const infoRouter = require('./info');
const settingsRouter = require('./settings');
const boardsRouter = require('./boards');
// const examRouter = require('./exam')
const serviceRouter = require('./service');

// const companyRouter = require('./company');
// const usersRouter = require('./users');
// const profileRouter = require('./profile');

//리소스 라우터
router.use('/auth', authRouter);
router.use('/my', myRouter);
router.use('/files', filesRouter);
router.use('/nice', niceRouter);
router.use('/info', infoRouter); // 어드민 서버 - 기본(원시) 정보
router.use('/settings', settingsRouter); // 어드민 서버 - 설정 정보
router.use('/boards', boardsRouter); // 어드민 서버 - 게시판 정보
// router.use('/exam', examRouter) // 어드민 서버 - 자격증 정보
router.use('/service', serviceRouter); // 타 서버 요청 받는 경로

// router.use('/company', companyRouter);
// router.use('/users', usersRouter);
// router.use('/profile', profileRouter);

module.exports = router;

// require('./serviceAuth')(router);
// require('./auth')(router);
// require('./user')(router);
// require('./company')(router);
// require('./profile')(router);
