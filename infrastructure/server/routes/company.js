const express = require('express');
const router = express.Router();

const { companyAdapter } = require('../../../adapters/inbound');
const { SuccessResponse, ErrorResponse } = require('../../response');

const extractToken = require('../modules/extractToken');
const decryptIdToken = require('../modules/decryptIdToken');

router.use(extractToken);
router.use(decryptIdToken);

// 등록된 기업들 가져오기 : 업체 검색   - 등록된 기업만 필터링
router.get('/list/registration', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;

        result = await companyAdapter.getCompanyList(userData);
        console.log('GET - /list/registration 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('/list/registration 에러응답 : ', error);
        next(error);
    }
});

// 업체 - 소속 상태변경(승인, 거절, 삭제)처리 ----------권한필요!!(해당기업 소속의 관리자 권한)
// 진행중인 프로젝트가 있는 경우 해제불가 : 해당 코드 프로젝트 진행 뒤 추가
router.put('/relation/status', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        let reqBodyData = req.filteredBody;
        console.log('요청 > /relation/status : ', userData, reqBodyData);

        result = await companyAdapter.updateRegistrationStatus(
            userData,
            reqBodyData
        );
        console.log('응답 > /relation/status : ', result);
        let belongingType = result['belonging_type'];
        console.log('--------------------', belongingType);
        // 이부분 다른 곳에서 처리 나눠야함!!!!!!!!!!!!!!!!!!!!!!!!!!! - 처리함
        // if (belongingType === 0) {
        //     response = new Response(200, '소속 해제 완료');
        // } else if (belongingType === 2) {
        //     response = new Response(200, '소속 요청 승인 완료');
        // } else {
        //     response = new Response(400, '소속 타입 에러 ');
        //     throw response;
        // }
        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('에러 > /relation/status : ', error);
        next(error);
    }
});

//선택 기업 소속 컨설턴트들 정보 가져오기
router.get('/:companyId/belonging/users/info', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        let reqParamsData = req.params;
        console.log('요청 데이터 : ', userData, reqParamsData);

        result = await companyAdapter.getCompanyBelongedUsersInfo(
            userData,
            reqParamsData
        );
        console.log('응답 > GET > /belonging/users/info : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('에러 > GET > /belonging/users/info : ', error);
        next(error);
    }
});

// 기업정보 가져오기
router.get('/:companyId/info', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        let reqParamsData = req.params;
        console.log('요청 > /:companyId/info : ', userData, reqParamsData);

        result = await companyAdapter.getCompanyInfo(userData, reqParamsData);
        console.log('응답 > /:companyId/info : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('에러 > /:companyId/info : ', error);
        next(error);
    }
});

module.exports = router;
