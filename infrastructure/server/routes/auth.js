const express = require('express');
const router = express.Router();

const qs = require('querystring');

const { authAdapter } = require('../../../adapters/inbound');
const { SuccessResponse, ErrorResponse } = require('../../response');

const { extractToken, decryptIdToken } = require('../middlewares');
const niceModule = require('../modules/nice_module/niceModule');

let niceRedirectUrl;

// module.exports = (router) => {
router.post('/checkemail', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('/checkemail 요청 : ', reqBodyData);

        result = await authAdapter.checkDuplicateEmail(reqBodyData);
        console.log('/checkemail 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        // 상태코드 204
        res.status(200).send(response);
    } catch (error) {
        console.log('/checkemail 에러 응답 : ', error);
        next(error);
    }
});
// 회원가입
router.post('/signup', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('/signup 요청 : ', reqBodyData);

        result = await authAdapter.signUp(reqBodyData);
        console.log('/signup 응답 : ', result);

        // response = new Response(201, '회원가입 완료 (Accepted)');
        response = new SuccessResponse(result.message, result.data);
        // 상태코드 201
        res.status(200).send(response);
    } catch (error) {
        console.log('/signup 에러 응답 : ', error);
        next(error);
    }
});
// 가입확인 메일 재발송
router.post('/resendemail', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        result = await authAdapter.resendComfirmEmail(reqBodyData);
        console.log('/resendemail 응답 : ', result);
        response = new SuccessResponse(result.message, result.data);
        // 상태코드 204
        res.status(200).send(response);
    } catch (error) {
        console.log('/resendemail 에러 응답 : ', error);
        next(error);
    }
});
//로그인
// TODO : login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
router.post('/login', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('/login 요청 : ', reqBodyData);

        result = await authAdapter.logIn(reqBodyData);
        console.log('/login 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.log('/login 에러 응답 : ', error);
        next(error);
    }
});
// 사용자 정보 변경 : 공통 : 비밀번호
router.put('/changepassword', extractToken, async (req, res) => {
    let result, response, errResponse;
    try {
        let accessToken = req.token;
        let reqBodyData = req.filteredBody;
        console.log('changepassword 요청 : ', reqBodyData);

        result = await authAdapter.changePassword(accessToken, reqBodyData);
        console.log('changepassword 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.log('changepassword 에러 응답 : ', error);
        next(error);
    }
});
// 사용자 인증 : 비밀번호 - 사용자 정보 수정 접근, 회원탈퇴 시 사용 API
router.post(
    '/verifyuser',
    extractToken,
    // getUserInfoByAccessToken,
    decryptIdToken,

    async (req, res, next) => {
        let result, response, errResponse;
        try {
            // let userData = req.userDataByAccessToken;
            let userData = req.userDataByIdToken;
            let reqBodyData = req.filteredBody;
            console.log(
                '/verifyuser 요청 : ',
                reqBodyData,
                '사용자 데이터 : ',
                userData
            );
            let verifyData = {
                email: userData.email,
                password: reqBodyData.password,
            };

            result = await authAdapter.verifyUserByPassword(verifyData);
            console.log('/verifyuser 응답 : ', result);

            response = new SuccessResponse(result.message, result.data);
            res.status(200).send(response);
        } catch (error) {
            console.log('/verifyuser 에러 응답 : ', error);
            next(error);
        }
    }
);

// 비밀번호 찾기 확인코드전송
router.post('/forgotpassword', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('/forgotpassword 요청 : ', reqBodyData);

        result = await authAdapter.forgotPassword(reqBodyData);
        console.log('/forgotpassword 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        // 상태코드 204
        res.status(200).send(response);
    } catch (error) {
        console.log('/forgotpassword 에러 : ', error);
        next(error);
    }
});
// 비밀번호 찾기 비밀번호 변경
router.post('/confirmforgotpassword', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('/confirmforgotpassword 요청 : ', reqBodyData);

        result = await authAdapter.confirmForgotPassword(reqBodyData);
        console.log('/confirmforgotpassword 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        // 상태코드 204
        res.status(200).send(response);
    } catch (error) {
        console.log('/confirmforgotpassword 에러 응답 : ', error);
        next(error);
    }
});
// 로그아웃
router.get('/logout', extractToken, async (req, res, next) => {
    let result, response, errResponse;
    try {
        let accessToken = req.token;
        console.log('/logOut 요청 : ', accessToken);

        result = await authAdapter.logOut(accessToken);
        console.log('/logOut 응답 : ');

        response = new SuccessResponse(result.message, result.data);
        // 상태코드 204
        res.status(200).send(response);
    } catch (error) {
        console.log('/logOut 에러 응답 : ', error);
        next(error);
    }
});
//refresh 토큰으로 access token 갱신
router.get('/newtoken', extractToken, async (req, res, next) => {
    let result, response, errResponse;
    try {
        let refreshToken = req.token;

        result = await authAdapter.issueNewToken(refreshToken);
        console.log('/newtoken 응답 : ', result);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.log('/newtoken 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 시작
router.get('/checkplus_main', async (req, res, next) => {
    let result, response;
    try {
        niceRedirectUrl = req.query.redirectUrl;

        result = await niceModule.main();
        // console.log('모듈시작 결과 : ', result);
        response = new SuccessResponse('본인 인증 모듈 시작 완료', result);
        res.status(200).send(response);
    } catch (error) {
        console.log('/checkplus_main 에러 응답 : ', error);
        res.send(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이상
router.get('/checkplus_success', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = req.param('EncodeData');

        result = await niceModule.successGet(encodeData);
        // console.log('모듈성공 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/checkplus_success 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이하 또는 다른 브라우저
router.post('/checkplus_success', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = req.filteredBody.EncodeData;

        result = await niceModule.successPost(encodeData);
        // console.log('모듈성공 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/checkplus_success 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이상
router.get('/checkplus_fail', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = req.param('EncodeData');

        result = await niceModule.failGet(encodeData);
        // console.log('모듈실패 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/checkplus_fail 에러 응답 : ', error);
        next(error);
    }
});
// 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이하 또는 다른 브라우저
router.post('/checkplus_fail', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let encodeData = request.body.EncodeData;

        result = await niceModule.failPost(encodeData);
        // console.log('모듈실패 결과 : ', result);

        res.redirect(`${niceRedirectUrl}?${qs.stringify(result)}`);
    } catch (error) {
        console.log('/checkplus_fail 에러 응답 : ', error);
        next(error);
    }
});

//테스트용 API -----------------------------------------------------
// // access token 유효기간 확인 - 미들웨어 처리
// router.get('/confirmtoken', extractToken, async (req, res, next) => {
//     let result, response, errResponse;
//     try {
//         let accessToken = req.token;
//         console.log('/confirmtoken 요청 : ', accessToken);

//         result = await authAdapter.checkAccessToken(accessToken);
//         console.log('/confirmtoken 응답 : ', result);

//         response = new SuccessResponse(result.message, result.data);
//         res.status(200).send(response);
//     } catch (error) {
//         console.log('/confirmtoken 에러 응답 : ', error);
//         next(error)
//     }
// });
//관리자 권한 처리 API
router.post('/deleteUserByAdmin', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('deleteUserByAdmin 요청 : ', reqBodyData);
        result = await authAdapter.deleteUserByAdmin(reqBodyData);

        console.log('deleteUserByAdmin 응답 : ', result);
        if (result.code === 'UserNotFoundException') {
            result.message = '삭제할 회원이 존재하지 않습니다(Not Found)';
        } else {
            result.message = '회원 삭제 성공';
        }
    } catch (error) {
        console.log('deleteUserByAdmin 에러 응답 : ', error);
        next(error);
    }
});
// 사용자 상태 변경 : 사용불가 처리
router.post('/disableUserByAdmin', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('disableUserByAdmin 요청 : ', reqBodyData);
        result = await authAdapter.disableUserByAdmin(reqBodyData);
        result.message = '사용자 사용 불가 처리 완료';

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.log('disableUserByAdmin 에러 응답 : ', error);
        next(error);
    }
});
// 사용자 상태 변경 : 사용가능 처리
router.post('/enableUserByAdmin', async (req, res, next) => {
    let result, response, errResponse;
    try {
        let reqBodyData = req.filteredBody;
        console.log('enableUserByAdmin 요청 : ', reqBodyData);
        result = await authAdapter.enableUserByAdmin(reqBodyData);

        response = new SuccessResponse(result.message, result.data);
        res.status(200).send(response);
    } catch (error) {
        console.log('enableUserByAdmin 에러 응답 : ', error);
        next(error);
    }
});

module.exports = router;
