// 컨설턴트 사용자 API
const express = require('express');
const router = express.Router();

const { consultantUsersAdapter } = require('../../../../adapters/inbound');
const { extractToken, decryptIdToken } = require('../../middlewares');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

// 컨설턴트 리스트 가져오기
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let reqQueryData = req.filteredQuery;
        console.log('GET - /api/user/consultant/users 요청 : ', reqQueryData);

        result = await consultantUsersAdapter.getConsultantUsers(reqQueryData);
        console.log('GET - /api/user/consultant/users 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error('/api/user/consultant/users 에러 응답 : ', error);
        next(error);
    }
});

// 개별 컨설턴트 정보 가져오기
router.get('/:consultantUserId', async (req, res, next) => {
    let result, response;
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 요청 : ',
            reqParamsData
        );

        result = await consultantUsersAdapter.getConsultantUser(reqParamsData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            '/api/user/consultant/users/:consultantUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 개별 컨설턴트 정보 수정하기
router.put('/:consultantUserId', async (req, res, next) => {
    let result, response;
    try {
        let reqBodyData = req.filteredBody;
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 요청 : ',
            reqBodyData
        );

        result = await consultantUsersAdapter.updateConsultantUser(reqBodyData);
        console.log(
            'GET - /api/user/consultant/users/:consultantUserId 응답 : ',
            result
        );

        response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'GET - /api/user/consultant/users/:consultantUserId',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            '/api/user/consultant/users/:consultantUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});

// 사용자 페이지 ---------------------------------------------------
router.use(extractToken);

module.exports = router;
