// 클라이언트 사용자 API
const express = require('express');
const router = express.Router();

const { clientUsersAdapter } = require('../../../../adapters/inbound');
const { extractToken, decryptIdToken } = require('../../middlewares');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

// 클라이언트 리스트 가져오기 : 클라이언트 컨설턴트 공통
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let reqQueryData = req.filteredQuery;
        console.log('GET - /api/user/client/users 요청 : ', reqQueryData);

        result = await clientUsersAdapter.getClientUsers(reqQueryData);
        console.log('GET - /api/user/client/users 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/client/users', response.message);

        res.send(response);
    } catch (error) {
        console.error('GET - /api/user/client/users 에러 응답 : ', error);
        next(error);
    }
});

// 개별 클라이언트 정보 가져오기 : 클라이언트 컨설턴트 공통
router.get('/:clientUserId', async (req, res, next) => {
    let result, response;
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/client/users/:clientUserId 요청 : ',
            reqParamsData
        );

        result = await clientUsersAdapter.getClientUser(reqParamsData);
        console.log(
            'GET - /api/user/client/users/:clientUserId 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/client/users', response.message);

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/client/users/:clientUserId 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 삭제는 없음, 관리자 페이지에서 클라이언트 사용자 수정 부분과 기업 수정부분 확인 후 API 생성

// 사용자 페이지 ---------------------------------------------------
router.use(extractToken);

module.exports = router;
