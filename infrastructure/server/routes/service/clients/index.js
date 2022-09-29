// 클라이언트
const express = require('express');
const router = express.Router();

const clientCompaniesRouter = require('./clientCompanies');

const {
    clientsAdapter,
    vouchersAdapter,
} = require('../../../../../adapters/inbound');
const { logger } = require('../../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../../adapters/response');

router.use('/companies', clientCompaniesRouter);

// 클라이언트 리스트 가져오기 : 관리자에서 요청
router.get('/', async (req, res, next) => {
    // console.log('gdklsfjsdlkfjslkdjf============', req.hostname, req.headers); // 요청 경로 확인
    try {
        console.log('GET - /api/user/clients 요청 : ');

        const result = await clientsAdapter.getClients();
        console.log('GET - /api/user/clients 응답 : ', result);

        const response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/clients', response.message);

        res.send(response);
    } catch (error) {
        console.error('GET - /api/user/clients 에러 응답 : ', error);
        next(error);
    }
});

// 클라이언트 정보 가져오기 : 관리자에서 요청
router.get('/:clientUserId', async (req, res, next) => {
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/clients/:clientUserId 요청 : ',
            reqParamsData
        );

        const result = await clientsAdapter.getClient(reqParamsData);
        console.log('GET - /api/user/clients/:clientUserId 응답 : ', result);

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/clients/:clientUserId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/clients/:clientUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});

// 클라이언트 사용자의 바우처 정보 생성하기
router.post('/:clientUserId/vouchers', async (req, res, next) => {
    try {
        const reqBodyData = req.filteredBody;

        console.log(
            'POST - /api/user/clients/:clientUserId/vouchers 요청 : ',
            reqBodyData
        );

        const result = await vouchersAdapter.createVoucher(reqBodyData);
        console.log(
            'POST - /api/user/clients/:clientUserId/vouchers 응답 : ',
            result
        );

        const response = new SuccessResponse(201, result);
        logger.log(
            'info',
            'POST - /api/user/clients/:clientUserId/vouchers',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'POST - /api/user/clients/:clientUserId/vouchers 에러 응답 : ',
            error
        );
        next(error);
    }
});

// 클라이언트 사용자의 바우처 리스트 가져오기
router.get('/:clientUserId/vouchers', async (req, res, next) => {
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/clients/:clientUserId/vouchers 요청 : ',
            reqParamsData
        );

        const result = await vouchersAdapter.getVouchersByClient(reqParamsData);
        console.log(
            'GET - /api/user/clients/:clientUserId/vouchers 응답 : ',
            result
        );

        const response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/clients/:clientUserId/vouchers',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/clients/:clientUserId/vouchers 에러 응답 : ',
            error
        );
        next(error);
    }
});

module.exports = router;
