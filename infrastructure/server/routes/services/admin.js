// 미들웨어로 각 서버 간 토큰 인증
// 서비스별 데이터 env 파일에 저장 : 서비스 타입, 서비스 id, 서비스 비밀번호
// 토큰 저장은 redis 사용

const express = require('express');
const router = express.Router();

const {
    serviceAuthAdapter,
    userAdapter,
} = require('../../../adapters/inbound');
const { SuccessResponse } = require('../../response');

const { extractToken, verifyServiceToken } = require('../middlewares');

// // 클라이언트 리스트 가져오기
// router.get('/clients', async (req, res, next) => {
//     let result, response;
//     console.log('사용자 정보 가져오기');
//     try {
//         // verify
//         let reqQueryData = req.filteredQuery;
//         console.log('쿼리데이터 ', reqQueryData);
//         result = await userAdapter.getUserInfo(reqQueryData);
//         console.log('결과 ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch {
//         console.error('에러 > /user/info : ', error);
//         next(error);
//     }
// });

module.exports = router;
