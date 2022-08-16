const express = require('express');
const router = express.Router();

const niceRouter = require('./nice');
const { logger } = require('../../../adapters/module');
const { authAdapter } = require('../../../adapters/inbound');
const { SuccessResponse } = require('../../../adapters/response');
const {
    CheckEmailRequestDto,
    LoginRequestDto,
    SignupRequestDto,
    ChangePasswordRequestDto,
    FindPasswordRequestDto,
    FindPasswordSettingRequestDto,
    UserReAuthRequestDto,
} = require('../../../adapters/dtos/requestDto/authDto');

const { extractToken, decryptIdToken } = require('../middlewares');
// 본인 인증 모듈
router.use('/nice', niceRouter);

// email 중복 확인
router.get('/check', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new CheckEmailRequestDto(req.filteredQuery);
        console.log('POST /api/user/auth/check 요청 : ', authData);

        result = await authAdapter.checkExistUser(authData);
        console.log('POST /api/user/auth/check 응답 : ', result);

        response = new SuccessResponse(204, result);
        logger.log('info', 'POST /api/user/auth/check', response.message);

        res.send(response);
    } catch (error) {
        console.log('POST /api/user/auth/check 에러 응답 : ', error);
        next(error);
    }
});

// 회원가입
router.post('/signup', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new SignupRequestDto(req.filteredBody);
        console.log('POST /api/user/auth/signup 요청 : ', authData);

        result = await authAdapter.signUp(authData);
        console.log('POST /api/user/auth/signup 응답 : ', result);

        response = new SuccessResponse(201, result);
        logger.log('info', 'POST /api/user/auth/signup', response.message);

        res.send(response);
    } catch (error) {
        console.log('POST /api/user/auth/signup 에러 응답 : ', error);
        next(error);
    }
});

//  가입확인 메일 재발송
router.post('/signup/resend', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new CheckEmailRequestDto(req.filteredBody);
        result = await authAdapter.resendSignUpEmail(authData);
        console.log('/signup/resend 응답 : ', result);

        response = new SuccessResponse(202, result);
        logger.log(
            'info',
            'POST /api/user/auth/signup/resend',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log('/signup/resend 에러 응답 : ', error);
        next(error);
    }
});

//로그인
// TODO : login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
router.post('/login', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new LoginRequestDto(req.filteredBody);
        console.log('POST > /api/user/auth/logIn 요청 : ', authData);

        result = await authAdapter.logIn(authData);
        console.log('POST > /api/user/auth/logIn 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log('info', 'POST /api/user/auth/logIn', response.message);

        res.send(response);
    } catch (error) {
        // console.error('POST > /api/user/auth/logIn 에러 응답 : ', error);
        next(error);
    }
});
// 비밀번호 찾기 : 확인코드 받기
router.get('/password/loss', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new FindPasswordRequestDto(req.filteredQuery);
        console.log('GET > /api/user/auth/password/loss 요청 : ', authData);

        result = await authAdapter.findPassword(authData);
        console.log('GET > /api/user/auth/password/loss 응답 : ', result);

        response = new SuccessResponse(202, result);
        logger.log(
            'info',
            'GET /api/user/auth/password/loss',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log('GET > /api/user/auth/password/loss 에러 응답 : ', error);
        next(error);
    }
});
// 비밀번호 찾기 : 코드 확인 > 비번 변경
router.put('/password/loss', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new FindPasswordSettingRequestDto(req.filteredBody);
        console.log('PUT > /api/user/auth/password/loss 요청 : ', authData);

        result = await authAdapter.updateForgotPassword(authData);
        console.log('PUT > /api/user/auth/password/loss 응답 : ', result);

        response = new SuccessResponse(202, result);
        logger.log(
            'info',
            'PUT /api/user/auth/password/loss',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log('PUT > /api/user/auth/password/loss 에러 응답 : ', error);
        next(error);
    }
});

//관리자 권한 처리 API : 테스트 용 API ------------------------
router.delete('/:email', async (req, res, next) => {
    let result, response;
    try {
        let { authData } = new CheckEmailRequestDto(req.params);
        console.log('deleteUserByAdmin 요청 : ', authData);
        result = await authAdapter.deleteUserByAdmin(authData);

        response = new SuccessResponse(204, result);
        logger.log(
            'info',
            'PUT /api/user/auth/password/loss',
            response.message
        );

        res.send(response);
        // console.log('deleteUserByAdmin 응답 : ', result);
        // if (result.code === 'UserNotFoundException') {
        //     result.message = '삭제할 회원이 존재하지 않습니다(Not Found)';
        // } else {
        //     result.message = '회원 삭제 성공';
        // }
    } catch (error) {
        console.log('deleteUserByAdmin 에러 응답 : ', error);
        next(error);
    }
});

// access Token or refresh token 사용 api =======================================================
router.use(extractToken);

// 로그아웃
router.get('/logout', async (req, res, next) => {
    console.log('로그아웃도착');
    let result, response;
    try {
        let accessToken = req.token;
        console.log('GET > /api/user/auth/logOut 요청 : ', accessToken);

        result = await authAdapter.logOut(accessToken);
        console.log('GET > /api/user/auth/logOut 응답 : ', result);

        response = new SuccessResponse(204, result);
        logger.log('info', 'GET /api/user/auth/logOut', response.message);

        res.send(response);
    } catch (error) {
        console.error('GET > /api/user/auth/logOut 에러 응답 : ', error);
        next(error);
    }
});

// 비밀번호 변경
router.put('/password', async (req, res, next) => {
    let result, response;
    try {
        let accessToken = req.token;
        let { authData } = new ChangePasswordRequestDto(req.filteredBody);

        console.log('PUT > /api/user/auth/password 요청 : ', authData);

        result = await authAdapter.changePassword(authData, accessToken);
        console.log('PUT > /api/user/auth/password 응답 : ', result);

        response = new SuccessResponse(204, result);
        logger.log('info', 'PUT /api/user/auth/password', response.message);

        res.send(response);
    } catch (error) {
        console.error('PUT > /api/user/auth/password 에러 응답 : ', error);
        next(error);
    }
});
// 토큰 재발급
router.get('/token/reissuance', async (req, res, next) => {
    let result, response;
    try {
        let refreshToken = req.token;

        console.log(
            'POST > /api/user/auth/token/reissuance 요청 : ',
            refreshToken
        );

        result = await authAdapter.reissueToken(refreshToken);
        console.log('POST > /api/user/auth/token/reissuance 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'POST /api/user/auth/token/reissuance',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log(
            'POST > /api/user/auth/token/reissuance 에러 응답 : ',
            error
        );
        next(error);
    }
});

// =============id token 사용

// 사용자 확인 : 로그인 흐름과 같음
router.post('/verification', decryptIdToken, async (req, res, next) => {
    let result, response;
    try {
        let userData = req.userDataByIdToken;
        let { authData } = new UserReAuthRequestDto(req.filteredBody);

        console.log(
            'POST > /api/user/auth/verification 요청 : ',
            userData,
            authData
        );
        let verifyUserData = {
            email: userData.email,
            password: authData.password,
        };

        result = await authAdapter.verifyUserByPassword(verifyUserData);
        console.log('POST > /api/user/auth/verification 응답 : ', result);

        response = new SuccessResponse(200, result);
        logger.log(
            'info',
            'POST /api/user/auth/verification',
            response.message
        );

        res.send(response);
    } catch (error) {
        console.log('POST > /api/user/auth/verification 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;

// //테스트용 API -----------------------------------------------------
// // // access token 유효기간 확인 - 미들웨어 처리
// // router.get('/confirmtoken', extractToken, async (req, res, next) => {

// // 사용자 상태 변경 : 사용불가 처리
// router.post('/disableUserByAdmin', async (req, res, next) => {
//     let result, response, errResponse;
//     try {
//         let reqBodyData = req.filteredBody;
//         console.log('disableUserByAdmin 요청 : ', reqBodyData);
//         result = await authAdapter.disableUserByAdmin(reqBodyData);
//         result.message = '사용자 사용 불가 처리 완료';

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.log('disableUserByAdmin 에러 응답 : ', error);
//         next(error);
//     }
// });
// // 사용자 상태 변경 : 사용가능 처리
// router.post('/enableUserByAdmin', async (req, res, next) => {
//     let result, response, errResponse;
//     try {
//         let reqBodyData = req.filteredBody;
//         console.log('enableUserByAdmin 요청 : ', reqBodyData);
//         result = await authAdapter.enableUserByAdmin(reqBodyData);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.log('enableUserByAdmin 에러 응답 : ', error);
//         next(error);
//     }
// });

// 이전 api --------------------------------------------
// const express = require('express');
// const router = express.Router();

// const qs = require('querystring');

// const { authAdapter } = require('../../../adapters/inbound');
// const { SuccessResponse } = require('../../../adapters/response');

// const { extractToken, decryptIdToken } = require('../middlewares');
// const niceModule = require('../modules/nice_module/niceModule');

// let niceRedirectUrl;

// // module.exports = (router) => {
// router.post('/checkemail', async (req, res, next) => {

// // 회원가입
// router.post('/signup', async (req, res, next) => {

//  가입확인 메일 재발송
// router.post('/resendemail', async (req, res, next) => {

// //로그인
// // TODO : login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
// router.post('/login', async (req, res, next) => {

// // 사용자 정보 변경 : 공통 : 비밀번호
// router.put('/changepassword', extractToken, async (req, res) => {

// // 사용자 인증 : 비밀번호 - 사용자 정보 수정 접근, 회원탈퇴 시 사용 API
// router.post(
//     '/verifyuser',
//     extractToken,

// // 비밀번호 찾기 확인코드전송
// router.post('/findPassword', async (req, res, next) => {

// // 비밀번호 찾기 비밀번호 변경
// router.post('/updateForgotPassword', async (req, res, next) => {

// // 로그아웃
// router.get('/logout', extractToken, async (req, res, next) => {

// //refresh 토큰으로 access token 갱신
// router.get('/newtoken', extractToken, async (req, res, next) => {
