const qs = require('querystring');
const { authAdapter } = require('../../../adapters/inbound');
const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');
// const decryptAccessToken = require('../modules/decryptAccessToken');
const getUserInfoByAccessToken = require('../modules/getUserInfoByAccessToken');
const niceModule = require('../modules/nice_module/niceModule');
let niceRedirectUrl;

module.exports = (router) => {
    router.post('/api/auth/checkemail', async (req, res) => {
        let result, response;
        try {
            let reqData = req.filteredData;
            console.log('/api/auth/checkemail 요청 : ', reqData);

            result = await authAdapter.checkDuplicateEmail(reqData);
            console.log('/api/auth/checkemail 응답 : ', result);

            response;
            if (!result.userExist) {
                response = new Response(
                    200,
                    '사용가능한 email 입니다.',
                    result
                );
            } else {
                response = new Response(
                    409,
                    '이미 가입된 email입니다.',
                    result // 예외처리 확인
                );
            }
            res.send(response);
        } catch (err) {
            console.log('/api/auth/checkemail 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 회원가입
    router.post('/api/auth/signup', async (req, res) => {
        let result, response;
        try {
            let reqData = req.filteredData;
            console.log('/api/auth/signup 요청 : ', reqData);

            result = await authAdapter.signUp(reqData);
            console.log('/api/auth/signup 응답 : ', result);

            response = new Response(201, '회원가입 완료 (Accepted)');
            res.send(response);
        } catch (err) {
            console.log('/api/auth/signup 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 가입확인 메일 재발송
    router.post('/api/auth/resendemail', async (req, res) => {
        let result, response;
        try {
            let reqData = req.filteredData;
            result = await authAdapter.resendComfirmEmail(reqData);
            console.log('결과 ------------------', result);
            response = new Response(200, '가입 메일 전송 완료');
            res.send(response);
        } catch (err) {
            console.log('에러 ------------------------', err);
            res.send(err);
        }
    });
    //로그인
    // TODO : login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
    router.post('/api/auth/login', async (req, res) => {
        let result, response;
        try {
            let reqData = req.filteredData;
            console.log('/api/auth/login 요청 : ', reqData);

            result = await authAdapter.logIn(reqData);
            console.log('/api/auth/login 응답 : ', result);

            response = new Response(200, '로그인 성공 (OK)', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/login 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 인증 : 비밀번호 - 사용자 정보 수정 접근, 회원탈퇴 시 사용 API
    router.post(
        '/api/auth/verifyuser',
        extractToken,
        getUserInfoByAccessToken,
        async (req, res) => {
            let result, response;
            try {
                let userData = req.userDataByAccessToken;
                let reqData = req.filteredData;
                console.log(
                    '/api/auth/verifyuser 요청 : ',
                    reqData,
                    '사용자 데이터 : ',
                    userData
                );
                let verifyData = {
                    email: userData.email,
                    password: reqData.password,
                };

                result = await authAdapter.verifyUserByPassword(verifyData);
                console.log('/api/auth/verifyuser 응답 : ', result);

                response = new Response(200, '사용자 인증 완료', result);
                res.send(response);
            } catch (err) {
                console.log('/api/auth/verifyuser 에러 응답 : ', err);
                res.send(err);
            }
        }
    );

    // 비밀번호 찾기 확인코드전송
    router.post('/api/auth/forgotpassword', async (req, res) => {
        let result, response;
        try {
            let reqData = req.filteredData;
            console.log('/api/auth/forgotpassword 요청 : ', reqData);

            result = await authAdapter.forgotPassword(reqData);
            console.log('/api/auth/forgotpassword 요청 : ', result);
            if (!result) {
                response = new Response(400, '가입되지 않은 메일 주소입니다.');
                res.send(response);
            } else {
                response = new Response(200, '인증번호 전송완료');
                res.send(response);
            }
        } catch (err) {
            console.log('/api/auth/forgotpassword 요청 : ', err);
            res.send(err);
        }
    });
    // 비밀번호 찾기 비밀번호 변경
    router.post('/api/auth/confirmforgotpassword', async (req, res) => {
        let result, response;
        try {
            let reqData = req.filteredData;
            console.log('/api/auth/confirmforgotpassword 요청 : ', reqData);

            result = await authAdapter.confirmForgotPassword(reqData);
            console.log('/api/auth/confirmforgotpassword 응답 : ', result);

            response = new Response(200, '비밀번호 변경완료', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/confirmforgotpassword 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 로그아웃
    router.get('/api/auth/logout', extractToken, async (req, res) => {
        let result, response;
        try {
            let accessToken = req.token;
            console.log('/api/auth/logOut 요청 : ', accessToken);

            result = await authAdapter.logOut(accessToken);
            console.log('/api/auth/logOut 응답 : ');

            response = new Response(204, '로그아웃 완료 (No Content)', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/logOut 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 휴대폰 본인 인증 (nice 모듈) 시작
    router.get('/api/auth/checkplus_main', async (req, res) => {
        let result, response;
        try {
            console.log('진입성공');
            niceRedirectUrl = req.query.redirectUrl;
            result = await niceModule.main();
            console.log('모듈시작 결과 : ', result);
            response = new Response(200, '본인 인증 모듈 시작 완료', result);
            res.send(response);
        } catch (err) {
            res.send(err);
        }
    });
    // 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이상
    router.get('/api/auth/checkplus_success', async (req, res) => {
        let result, response;
        try {
            let encodeData = req.param('EncodeData');
            console.log('success 진입성공');
            result = await niceModule.successGet(encodeData);
            console.log('모듈성공 결과 : ', result);
            response = new Response(200, '본인 인증 완료', result);
            res.redirect(`${niceRedirectUrlqs}?${qs.stringify(response)}`);
        } catch (err) {
            res.send(err);
        }
    });
    // 휴대폰 본인 인증 (nice 모듈) 성공 처리 : chrome 80 이하 또는 다른 브라우저
    router.post('/api/auth/checkplus_success', async (req, res) => {
        let result, response;
        try {
            let encodeData = req.filteredData.EncodeData;

            console.log('success 진입성공', encodeData);
            result = await niceModule.successPost(encodeData);
            console.log('모듈성공 결과 : ', result);
            response = new Response(200, '본인 인증 완료', result);
            res.send(response);
        } catch (err) {
            res.send(err);
        }
    });
    // 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이상
    router.get('/api/auth/checkplus_fail', async (req, res) => {
        let result, response;
        try {
            let encodeData = req.param('EncodeData');

            console.log('fail 진입성공');
            result = await niceModule.failGet(encodeData);
            console.log('모듈실패 결과 : ', result);
            response = new Response(400, '본인 인증 실패', result);
            res.send(response);
        } catch (err) {
            res.send(err);
        }
    });
    // 휴대폰 본인 인증 (nice 모듈) 실패 처리 : chrome 80 이하 또는 다른 브라우저
    router.post('/api/auth/checkplus_fail', async (req, res) => {
        let result, response;
        try {
            let encodeData = request.body.EncodeData;

            console.log('fail 진입성공');
            result = await niceModule.failPost(encodeData);
            console.log('모듈실패 결과 : ', result);
            response = new Response(400, '본인 인증 실패', result);
            res.send(response);
        } catch (err) {
            res.send(err);
        }
    });
    // access token 유효기간 확인
    router.get('/api/auth/confirmtoken', extractToken, async (req, res) => {
        let result, response;
        try {
            let accessToken = req.token;
            console.log('/api/auth/confirmtoken 요청 : ', accessToken);

            result = await authAdapter.checkAccessToken(accessToken);
            console.log('/api/auth/confirmtoken 응답 : ', result);

            response = new Response(200, '유효한 토큰입니다.', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/confirmtoken 에러 응답 : ', err);
            res.send(err);
        }
    });
    //refresh 토큰으로 access token 갱신
    router.get('/api/auth/newtoken', extractToken, async (req, res) => {
        let result, response;
        try {
            let refreshToken = req.token;

            result = await authAdapter.issueNewToken(refreshToken);
            console.log('/api/auth/newtoken 응답 : ', result);

            response = new Response(200, '토큰 갱신 완료', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/newtoken 에러 응답 : ', err);
            res.send(err);
        }
    });

    //테스트용 API -----------------------------------------------------
    //관리자 권한 처리 API
    router.post('/api/auth/deleteUserByAdmin', (req, res) => {
        let result, response;

        let reqData = req.filteredData;
        console.log('deleteUserByAdmin 요청 : ', reqData);
        response = authAdapter.deleteUserByAdmin(reqData);
        response.then((resData) => {
            console.log('deleteUserByAdmin 응답 : ', resData);
            if (resData.code === 'UserNotFoundException') {
                res.send({
                    status: 404,
                    message: '삭제할 회원이 존재하지 않습니다(Not Found',
                });
            } else {
                res.send({ status: 204, message: '회원 삭제 성공' });
            }
        });
    });
    router.post('/api/auth/disableUserByAdmin', (req, res) => {
        let result, response;

        let reqData = req.filteredData;
        console.log('disableUserByAdmin 요청 : ', reqData);
        response = authAdapter.disableUserByAdmin(reqData);
        response.then((resData) => res.send(resData));
    });
    router.post('/api/auth/enableUserByAdmin', (req, res) => {
        let reqData = req.filteredData;
        console.log('disableUserByAdmin 요청 : ', reqData);
        response = authAdapter.enableUserByAdmin(reqData);
        response.then((resData) => res.send(resData));
    });
};
