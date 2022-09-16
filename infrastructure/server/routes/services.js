// 타 서버 인증 컨트롤러
const express = require('express');
const router = express.Router();

const {
    IssueServiceTokenRequestDto,
} = require('../../../adapters/dtos/requestDto/servicesDto');
const { servicesAdapter } = require('../../../adapters/inbound');

const { extractToken, verifyOtherServerToken } = require('../middlewares');
const { logger } = require('../../../adapters/module');
const { SuccessResponse } = require('../../../adapters/response');

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

// 각 서비스 토큰 확인 - 테스트용
const { adminServer } = require('../../otherServer');
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

// 지역가져오기 - 테스트용
router.get('/region', async (req, res, next) => {
    try {
        // let reqBodyData = new IssueServiceTokenRequestDto(req.filteredBody);
        // let { serviceData } = reqBodyData;

        const result = await adminServer.getRegion();

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

module.exports = router;
