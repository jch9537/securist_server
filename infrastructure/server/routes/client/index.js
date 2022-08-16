// 클라이언트
const express = require('express');
const router = express.Router();

const clientUsersRouter = require('./clientUsers');
const clientCompaniesRouter = require('./clientCompanies');

router.use('/users', clientUsersRouter);
router.use('/companies', clientCompaniesRouter);

module.exports = router;
