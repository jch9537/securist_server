const { authAdapter } = require('../../../adapters/inbound');
const Response = require('../modules/Response');
const extractToken = require('../modules/extractToken');

module.exports = (router) => {
    // 중복 이메일 체크
    router.post('/api/auth/checkemail', async (req, res) => {
        let email = req.filteredData.email;
        console.log('/api/auth/checkemail 요청 : ', email);
        try {
            let result = await authAdapter.checkDuplicateEmail(email);
            console.log('/api/auth/checkemail 응답 : ', result);
            let response;
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
        let reqData = req.filteredData;
        console.log('/api/auth/signup 요청 : ', reqData);
        try {
            let result = await authAdapter.signUp(reqData);
            console.log('/api/auth/signup 응답 : ', result);
            let response = new Response(
                201,
                '회원가입 완료 (Accepted)',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/auth/signup 에러 응답 : ', err);
            res.send(err);
        }
    });
    //로그인
    // TODO : login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
    router.post('/api/auth/login', async (req, res) => {
        let reqData = req.filteredData;
        console.log('/api/auth/login 요청 : ', reqData);
        try {
            let result = await authAdapter.logIn(reqData);
            console.log('/api/auth/login 응답 : ', result);
            let response = new Response(200, '로그인 성공 (OK)', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/login 에러 응답 : ', err);
            res.send(err);
        }
    });
    //로그아웃
    router.post('/api/auth/logout', extractToken, async (req, res) => {
        let accessToken = req.token;
        console.log('/api/auth/logOut 요청 : ', accessToken);
        try {
            let result = await authAdapter.logOut(accessToken);
            console.log('/api/auth/logOut 응답 : ', result);
            let response = new Response(
                204,
                '로그아웃 완료 (No Content)',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/auth/logOut 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 비밀번호 변경
    router.post('/api/auth/changepassword', async (req, res) => {
        let reqData = req.filteredData;
        console.log('changepassword 요청 : ', reqData);

        try {
            let result = await authAdapter.changePassword(reqData);
            console.log('changepassword 응답 : ', result);
            let response = new Response(200, '비밀번호 변경완료', result);
            res.send(response);
        } catch (err) {
            console.log('changepassword 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 비밀번호 찾기 확인코드전송
    router.post('/api/auth/forgotpassword', async (req, res) => {
        let email = req.filteredData.email;
        console.log('/api/auth/forgotpassword 요청 : ', email);
        try {
            let result = await authAdapter.forgotPassword(email);
            console.log('/api/auth/forgotpassword 요청 : ', result);
            let response = new Response(200, '인증번호 전송완료', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/forgotpassword 요청 : ', err);
            res.send(err);
        }
    });
    // 비밀번호 찾기 비밀번호 변경
    router.post('/api/auth/confirmforgotpassword', async (req, res) => {
        let reqData = req.filteredData;
        console.log('/api/auth/confirmforgotpassword 요청 : ', reqData);
        try {
            let result = await authAdapter.confirmForgotPassword(reqData);
            console.log('/api/auth/confirmforgotpassword 응답 : ', result);
            let response = new Response(200, '비밀번호 변경완료', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/confirmforgotpassword 에러 응답 : ', err);
            res.send(err);
        }
    });
    // access token 유효기간 확인
    router.get('/api/auth/confirmtoken', extractToken, async (req, res) => {
        try {
            let accessToken = req.token;
            console.log('/api/auth/confirmtoken 요청 : ', accessToken);
            let result = await authAdapter.checkAccessToken(accessToken);
            console.log('/api/auth/confirmtoken 응답 : ', result);
            let response = new Response(200, '유효한 토큰입니다.', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/confirmtoken 에러 응답 : ', err);
            res.send(err);
        }
    });
    //refresh 토큰으로 access token 갱신
    router.get('/api/auth/newtoken', extractToken, async (req, res) => {
        try {
            let refreshToken = req.token;
            let result = await authAdapter.issueNewToken(refreshToken);
            console.log('/api/auth/newtoken 응답 : ', result);
            let response = new Response(200, '토큰 갱신 완료', result);
            res.send(response);
        } catch (err) {
            console.log('/api/auth/newtoken 에러 응답 : ', err);
            res.send(err);
        }
    });

    router.get('/api/user', extractToken, async (req, res) => {
        try {
            let idToken = req.token;
            console.log('/api/user 요청 : ', idToken);
            let result = await authAdapter.getUserByIdToken(idToken);
            console.log('/api/user 응답 : ', result);
            let response = new Response(
                200,
                '사용자 정보가져오기 완료 - idToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/user 에러 응답 : ', result);
            res.send(err);
        }
    });

    router.get('/api/userInfo', extractToken, async (req, res) => {
        let accessToken = req.token;
        try {
            console.log('/api/userInfo 요청 : ', accessToken);
            let result = await authAdapter.getUserInfo(accessToken);
            console.log('/api/userInfo 응답 : ', result);
            let response = new Response(
                200,
                '사용자 정보가져오기 완료 - accessToken',
                result
            );
            res.send(response);
        } catch (err) {
            console.log('/api/userInfo 에러 응답 : ', err);
            res.send(err);
        }
    });

    //테스트용 API -----------------------------------------------------
    //관리자 권한 처리 API
    router.post('/api/auth/deleteUserByAdmin', (req, res) => {
        let reqData = req.filteredData;
        console.log('deleteUserByAdmin 요청 : ', reqData);
        let response = authAdapter.deleteUser(reqData);
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
        let reqData = req.filteredData;
        console.log('disableUserByAdmin 요청 : ', reqData);
        let response = authAdapter.disableUser(reqData);
        response.then((resData) => res.send(resData));
    });
    router.post('/api/auth/enableUserByAdmin', (req, res) => {
        let reqData = req.filteredData;
        console.log('disableUserByAdmin 요청 : ', reqData);
        let response = authAdapter.enableUser(reqData);
        response.then((resData) => res.send(resData));
    });
};
