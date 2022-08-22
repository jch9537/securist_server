// 내 정보 API
const express = require('express');
const router = express.Router();

const { myAdapter } = require('../../../adapters/inbound');
const { extractToken, decryptIdToken } = require('../middlewares');
const {
    UpdateMyInfoRequestDto,
} = require('../../../adapters/dtos/requestDto/myInfoDto');
const { logger } = require('../../../adapters/module/logger');
const { SuccessResponse } = require('../../../adapters/response');

router.use(extractToken);
router.use(decryptIdToken);

// 내 사용자 정보 가져오기 : 클라이언트 컨설턴트 공통
router.get('/', async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        console.log('GET - /api/user/my 요청 : ', userData);

        result = await myAdapter.getMyInfo(userData);
        console.log('GET - /api/user/my 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log('info', 'GET - /api/user/my', response.message);

        res.send(response);
    } catch (error) {
        console.error('/api/user/my 에러 응답 : ', error);
        next(error);
    }
});

// 내 정보 변경
router.put('/', async (req, res, next) => {
    let result, response;
    result;
    try {
        let userData = req.userDataByIdToken;
        let { myData } = new UpdateMyInfoRequestDto(req.filteredBody);
        console.log('PUT - /api/user/my 요청 : ', userData, myData);

        result = await myAdapter.updateMyInfo(userData, myData);
        console.log('PUT - /api/user/my 응답 : ', result);

        response = new SuccessResponse(204, result);
        logger.log('info', 'PUT - /api/user/my', response.message);

        res.send(response);
    } catch (error) {
        console.error('PUT - /api/user/my 에러 응답 : ', error);
        next(error);
    }
});
// // 사용자 정보 변경 - 컨설턴트 공통 : 입금정보
// router.put('/info/bankinfo', async (req, res, next) => {
//     let result, response;
//     try {
//         let userData = req.userDataByIdToken;
//         let reqBodyData = req.filteredBody;
//         console.log('PUT - /info/bankinfo 요청 : ', userData, reqBodyData);

//         result = await myAdapter.updateBankInfo(userData, reqBodyData);
//         console.log('PUT - /info/bankinfo 응답 : ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.error('PUT - /info/bankinfo 에러 응답 : ', error);
//         next(error);
//     }
// });
// 회원 탈퇴 : 윤이사님 확인 후 처리 : 정책논의와 다른 기능완성 후 작업진행!!
router.delete('/', async (req, res, next) => {
    let result, response;
    try {
        let accessToken = req.token;
        let reqBodyData = req.filteredBody;
        console.log('DELETE - /api/user 요청 : ', accessToken, reqBodyData);

        result = await myAdapter.deleteUser(accessToken, reqBodyData);
        console.log('DELETE - /api/user 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.error('DELETE - /api/user 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
