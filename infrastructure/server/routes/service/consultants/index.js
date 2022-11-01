// 컨설턴트
const express = require('express');
const router = express.Router();

const consultantCompaniesRouter = require('./consultantCompanies');

const { consultantsAdapter } = require('../../../../../adapters/inbound');
const { logger } = require('../../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../../adapters/response');

router.use('/companies', consultantCompaniesRouter);

// 컨설턴트 리스트 가져오기 : 관리자에서 요청
router.get('/', async (req, res, next) => {
    // console.log('gdklsfjsdlkfjslkdjf============', req.hostname, req.headers); // 요청 경로 확인
    try {
        console.log('GET - /api/user/consultants 요청 : ');

        const result = await consultantsAdapter.getConsultants();
        console.log('GET - /api/user/consultants 응답 : ', result);

        const response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/consultants', response.message);

        res.send(response);
    } catch (error) {
        console.error('GET - /api/user/consultants 에러 응답 : ', error);
        next(error);
    }
});

// 컨설턴트 정보 가져오기 : 관리자에서 요청
router.get('/:consultantUserId', async (req, res, next) => {
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultants/:consultantUserId 요청 : ',
            reqParamsData
        );

        const result = await consultantsAdapter.getConsultant(reqParamsData);
        console.log(
            'GET - /api/user/consultants/:consultantUserId 응답 : ',
            result
        );

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultants/:consultantUserId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/consultants/:consultantUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});

module.exports = router;
