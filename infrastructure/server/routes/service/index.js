// 타 서버 요청 처리
const express = require('express');
const router = express.Router();

const clientsRouter = require('./clients');
const consultantsRouter = require('./consultants');

const {
    IssueServiceTokenRequestDto,
} = require('../../../../adapters/dtos/requestDto/servicesDto');
const { servicesAdapter } = require('../../../../adapters/inbound');

const { extractToken, verifyOtherServerToken } = require('../../middlewares');
const { logger } = require('../../../../adapters/module');
const { SuccessResponse } = require('../../../../adapters/response');

//-----------------------각 서비스 인증 요청 처리--------------------------------

// 각 서비스 확인/토큰 발급
router.post('/issuetoken', async (req, res, next) => {
    try {
        const { serviceData } = new IssueServiceTokenRequestDto(
            req.filteredBody
        );
        const result = await servicesAdapter.issueToken(serviceData);

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'POST /api/user/services/issuetoken',
            response.message
        );
        res.send(response);
    } catch (error) {
        console.log('라우터 에러 : ', error);
        next(error);
    }
});

// 테스트용 --------------------------------------------------------
// 각 서비스 토큰 확인 - 테스트용
const { adminServer } = require('../../../otherServer');
router.get('/request/issuetoken', async (req, res, next) => {
    try {
        // let reqBodyData = new IssueServiceTokenRequestDto(req.filteredBody);
        // let { serviceData } = reqBodyData;

        const result = await adminServer.requestIssueToken();

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'POST /api/admin/services/issuetoken',
            response.message
        );
        res.send(response);
    } catch (error) {
        console.log('라우터 에러 : ', error);
        next(error);
    }
});

// 타 서버 데이터 요청에 대해 처리/응답 API ===================================
router.use(extractToken, verifyOtherServerToken);

router.use('/clients', clientsRouter);
router.use('/consultants', consultantsRouter);

module.exports = router;
