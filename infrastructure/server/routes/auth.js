// TODO login usecase layer 예외처리(유효성) 추가확인
const { token } = require('../../middleware');
const { authAdapter } = require('../../../adapters/inbound');
// const { success, error } = require('../../exceptions/index');

module.exports = (router) => {
    router.post('/api/auth/checkemail', async (req, res) => {
        let email = req.body.email;
        console.log('checkemail 요청 : ', email);
        try {
            let response = await authAdapter.findUserByEmail(email);
            console.log('checkemail 응답 : ', response);
            res.send(response);
        } catch (err) {
            console.log('checkemail 에러 : ', err);
            res.send(err);
        }
    });
    router.post('/api/auth/signup', async (req, res) => {
        let reqData = req.body;
        console.log('signup 요청 : ', reqData);
        try {
            let response = await authAdapter.signUp(reqData);
            console.log('signup 응답 : ', response);
            res.send(response);
        } catch (err) {
            console.log('signup 에러 응답 : ', err);
            res.send(err);
        }
    });
    // login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
    router.post('/api/auth/login', async (req, res) => {
        let reqData = req.body;
        console.log('login 요청 : ', reqData);
        try {
            let response = await authAdapter.logIn(reqData);
            console.log('login 응답 : ', response.data);
            //비번 만료기간확인
            let userInfo = await token.decodeToken(response.data.IdToken);
            const passwordExp =
                Number(userInfo['custom:passwordUpdatedAt']) +
                60 * 60 * 24 * 90;
            const now = Math.floor(new Date().valueOf() / 1000);
            if (passwordExp < now) response.data.isPasswordExpired = true;
            else response.data.isPasswordExpired = false;

            res.send(response);
        } catch (err) {
            console.log('login 에러 응답 : ', err);
            res.send(err);
        }
    });
    router.post('/api/auth/logout', async (req, res) => {
        // console.log('logOut 요청 : ', req);
        try {
            let result = await token.checkAccessToken(req);
            let accessToken = token.extractToken(req);
            if (result.isValid) {
                let response = await authAdapter.logOut(accessToken);
                console.log('logOut 응답 : ', response);
                res.send(response);
            }
        } catch (err) {
            console.log('logOut 에러 응답 : ', err);
            res.send(err);
        }
    });
    // 사용자 비밀번호 변경
    router.post('/api/auth/changepassword', async (req, res) => {
        let reqData = req.body;
        console.log('changepassword 요청 : ', reqData);

        try {
            let result = await authAdapter.changePassword(reqData);
            res.send(result);
        } catch (err) {
            res.send(err);
        }
    });
    // 비밀번호 찾기 확인코드전송
    router.post('/api/auth/forgotpassword', async (req, res) => {
        let email = req.body.email;
        console.log('forgotpassword 요청 : ', email);
        try {
            let result = await authAdapter.forgotPassword(email);
            res.send(result);
        } catch (err) {
            res.send(err);
        }
    });
    // 비밀번호 찾기 비밀번호 변경
    router.post('/api/auth/confirmforgotpassword', async (req, res) => {
        let reqData = req.body;
        try {
            let result = await authAdapter.confirmForgotPassword(reqData);
            console.log('confirmforgotpassword 요청 : ', result);
            res.send(result);
        } catch (err) {
            res.send(err);
        }
    });
    // access token 유효기간 확인
    router.get('/api/auth/confirmtoken', async (req, res) => {
        try {
            let result = await token.checkAccessToken(req);
            console.log('result : ', result);
            res.send(result);
        } catch (err) {
            console.log('err : ', err);
            res.send(err);
        }
    });
    //refresh 토큰으로 access token 갱신
    router.get('/api/auth/newtoken', async (req, res) => {
        try {
            let result = await authAdapter.issueNewToken(req);
            console.log('newtoken 응답 : ', result);
            res.send(result);
        } catch (err) {
            console.log('newtoken 에러 응답 : ', err);
            res.send(err);
        }
    });

    router.get('/api/user', async (req, res) => {
        try {
            let result = await token.getUserByIdToken(req);
            console.log('++++++++++++++++++++++++++++++++++', result);
            res.send(result);
        } catch (err) {
            res.send(err);
        }
    });

    //관리자-----------------------------------------------------
    //테스트용 API
    router.post('/api/auth/deleteUserByAdmin', (req, res) => {
        let reqData = req.body;
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
        let reqData = req.body;
        console.log('disableUserByAdmin 요청 : ', reqData);
        let response = authAdapter.disableUser(reqData);
        response.then((resData) => res.send(resData));
    });
    router.post('/api/auth/enableUserByAdmin', (req, res) => {
        let reqData = req.body;
        console.log('disableUserByAdmin 요청 : ', reqData);
        let response = authAdapter.enableUser(reqData);
        response.then((resData) => res.send(resData));
    });
};
