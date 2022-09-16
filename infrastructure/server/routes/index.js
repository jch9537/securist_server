const express = require('express');
const router = express.Router();

const servicesRouter = require('./services');
const authRouter = require('./auth');
const clientsRouter = require('./clients');
const consultantsRouter = require('./consultants');
const myRouter = require('./my');
const filesRouter = require('./files');
// const companyRouter = require('./company');
// const usersRouter = require('./users');
// const profileRouter = require('./profile');

//리소스 라우터
router.use('/services', servicesRouter);
router.use('/auth', authRouter);
router.use('/my', myRouter);
router.use('/clients', clientsRouter);
router.use('/consultants', consultantsRouter);
router.use('/files', filesRouter);
// router.use('/company', companyRouter);
// router.use('/users', usersRouter);
// router.use('/profile', profileRouter);

module.exports = router;

// require('./serviceAuth')(router);
// require('./auth')(router);
// require('./user')(router);
// require('./company')(router);
// require('./profile')(router);
