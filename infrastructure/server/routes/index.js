const express = require('express');
const router = express.Router();

const serviceAuthRouter = require('./serviceAuth');
const authRouter = require('./auth');
const userRouter = require('./user');
const companyRouter = require('./company');
const profileRouter = require('./profile');

//리소스 라우터
router.use('/service', serviceAuthRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/company', companyRouter);
router.use('/profile', profileRouter);

module.exports = router;

// require('./serviceAuth')(router);
// require('./auth')(router);
// require('./user')(router);
// require('./company')(router);
// require('./profile')(router);
