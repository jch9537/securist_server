// 컨설턴트
const express = require('express');
const router = express.Router();

const consultantUsersRouter = require('./consultantUsers');
const consultantCompaniesRouter = require('./consultantCompanies');

router.use('/users', consultantUsersRouter);
router.use('/companies', consultantCompaniesRouter);

module.exports = router;
