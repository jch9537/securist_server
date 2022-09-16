// 클라이언트 사용자 API
const express = require('express');
const router = express.Router();

const { clientCompaniesAdapter } = require('../../../../adapters/inbound');
const { extractToken, decryptIdToken } = require('../../middlewares');
const { logger } = require('../../../../adapters/module/logger');
const { SuccessResponse } = require('../../../../adapters/response');

// 클라이언트 기업 리스트 가져오기
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        console.log('GET - /api/user/client/companies 요청 : ');

        result = await clientCompaniesAdapter.getClientCompanies();
        console.log('GET - /api/user/client/companies 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/client/companies',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error('GET - /api/user/client/companies 에러 응답 : ', error);
        next(error);
    }
});

// 개별 클라이언트 기업 정보 가져오기
router.get('/:clientCompanyId', async (req, res, next) => {
    try {
        let reqParamsData = req.params;
        console.log(
            'GET - /api/user/client/companies/:clientCompanyId 요청 : ',
            reqParamsData
        );

        result = await clientCompaniesAdapter.getClientCompany(reqParamsData);
        console.log(
            'GET - /api/user/client/companies/:clientCompanyId 응답 : ',
            result
        );

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'GET - /api/user/client/companies',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/client/companies/:clientCompanyId 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 개별 클라이언트 기업 정보 수정하기
router.put('/:clientCompanyId', async (req, res, next) => {
    try {
        const reqBodyData = req.filteredBody;
        console.log(
            'GET - /api/user/client/companies/:clientCompanyId 요청 : ',
            reqBodyData
        );

        const result = await clientCompaniesAdapter.updateClientCompany(reqBodyData);
        console.log(
            'GET - /api/user/client/companies/:clientCompanyId 응답 : ',
            result
        );

        const response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'GET - /api/user/client/companies',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.error(
            'GET - /api/user/client/companies/:clientCompanyId 에러 응답 : ',
            error
        );
        next(error);
    }
});
// 삭제는 없음, 관리자 페이지에서 클라이언트 사용자 수정 부분과 기업 수정부분 확인 후 API 생성

module.exports = router;
