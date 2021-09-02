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
const processingToken = require('../../webService/authService/awsMiddleware/processingToken');

//-----------------------각 서비스 인증 요청 처리--------------------------------

// 각 서비스 확인/토큰 발급
router.post('/issuetoken', async (req, res, next) => {
    console.log('도착???');
    let result, response;
    try {
        let reqBodyData = req.filteredBody;
        console.log('요청', reqBodyData);
        result = await serviceAuthAdapter.issueToken(reqBodyData);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.log('라우터 에러 : ', error);
        next(error);
    }
});

//---------------------아래 API에만 적용 미들웨어 -------------------------------

router.use(extractToken);
router.use(verifyServiceToken);

// --------------- 각 서버 cognito publice 키 제공 API ------------------------

router.get('/publickey', async (req, res, next) => {
    let result, response;
    try {
        result = await processingToken.getPublicKeys();
        console.log('결과 ', result);

        response = new SuccessResponse('퍼블릭 키 발급 완료', result);
        res.status(200).send(response);
    } catch (error) {
        next(error);
    }
});

//-----------------------각 서비스 데이터 요청 처리------------------------------

// 사용자 DB 정보 가져오기
router.get('/user/info', async (req, res, next) => {
    let result, response;
    console.log('사용자 정보 가져오기');
    try {
        // verify
        let reqQueryData = req.filteredQuery;
        console.log('쿼리데이터 ', reqQueryData);
        result = await userAdapter.getUserInfo(reqQueryData);
        console.log('결과 ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch {
        console.error('에러 > /user/info : ', error);
        next(error);
    }
});

// 사용자 소속 기업 정보 가져오기
router.get(
    '/user/belonging/company/info',
    verifyServiceToken,
    async (req, res, next) => {
        let result, response;
        console.log('기업 정보 가져오기');
        try {
            let reqQueryData = req.filteredQuery;
            result = await userAdapter.getUserBelongingCompanyInfo(
                reqQueryData
            );
            console.log('결과 ', result);

            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch {
            console.error('에러 > /user/info : ', error);
            next(error);
        }
    }
);

module.exports = router;

// // 필요없음 (확인) - 각 서비스 인증 : 토큰 확인
// router.get('/verify', async (req, res, next) => {
//     let result, response;
//     try {
//         let reqToken = req.filteredToken; // 테스트 후 살리기
//         // let reqToken = req.token; // 테스트 후 미들웨어와 함께 삭제
//         // let reqParamData = req.params;
//         // reqParamData.serviceToken = reqToken;
//         // console.log('reqParamData', req.params, 'reqToken', req.filteredToken);

//         result = await serviceAuthAdapter.verifyServiceToken(reqToken);

//         // result = req.verifyServiceToken;
//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.log('라우터 에러 : ', error);
//         next(error);
//     }
// });

// // access token이 만료되었을 때 refresh token으로 갱신 처리
// router.post('/renewtoken', async (req, res, next) => {});
