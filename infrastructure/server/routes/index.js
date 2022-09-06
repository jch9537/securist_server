const express = require('express');
const router = express.Router();

const serviceAuthRouter = require('./serviceAuth');
const authRouter = require('./auth');
const clientRouter = require('./client');
const consultantRouter = require('./consultant');
const myRouter = require('./my');
const companyRouter = require('./company');
const filesRouter = require('./files');
// const usersRouter = require('./users');
// const profileRouter = require('./profile');

//리소스 라우터
router.use('/service', serviceAuthRouter);
router.use('/auth', authRouter);
router.use('/my', myRouter);
router.use('/client', clientRouter);
router.use('/consultant', consultantRouter);
router.use('/company', companyRouter);
router.use('/files', filesRouter);
// router.use('/users', usersRouter);
// router.use('/profile', profileRouter);

module.exports = router;

// require('./serviceAuth')(router);
// require('./auth')(router);
// require('./user')(router);
// require('./company')(router);
// require('./profile')(router);
