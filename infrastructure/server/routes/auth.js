//TODO logout- refresh 토큰 처리, login 추가확인 처리
//TODO token decode 확인 /
// const jwtDecode = require('jwt-decode');
const { handler } = require('../../utils/token');

const { authAdapter } = require('../../../adapters/inbound');
const { success, error } = require('../../../adapters/exceptions');

module.exports = (router) => {
    router.post('/api/auth/checkemail', (req, res) => {
        let email = req.body.email;
        console.log('checkemail 요청 : ', email);
        let response = authAdapter.findUserByEmail(email);
        response
            .then((resData) => {
                console.log('checkemail 응답 : ', resData);
                resData
                    ? res.send(error.userAlreadyExist(resData))
                    : res.send(success.enabledUser(resData));
            })
            .catch((err) => {
                console.log('checkemail 에러 : ', err);
                res.send(err);
            });
    });
    router.post('/api/auth/signup', (req, res) => {
        let reqData = req.body;
        console.log('signup 요청 : ', reqData);
        let response = authAdapter.signUp(reqData);
        response
            .then((resData) => {
                console.log('signup 응답 : ', resData);
                res.send(resData);
            })
            .catch((err) => {
                console.log('signup 에러 응답 : ', err);
                res.send(err);
            });
    });
    // login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
    router.post('/api/auth/login', (req, res) => {
        let reqData = req.body;
        console.log('login 요청 : ', reqData);
        let response = authAdapter.logIn(reqData);
        response
            .then((resData) => {
                console.log('login 응답 : ', resData);
                //서버에서 클라이언트로 token을 보낼때 cookie와 response의 각 방법(둘 다 상관없지만)의 장단점 알아보기
                res.send(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    });
    router.post('/api/auth/logout', (req, res) => {
        let reqHeader = req.headers.authorization;
        if (reqHeader !== undefined) {
            let bearer = reqHeader.split(' ');
            let token = bearer[1];
            console.log('logOut 요청 : ', token);
            let response = authAdapter.logOut(token);
            response
                .then((resData) => {
                    console.log('logOut 응답 : ', resData);
                    res.send(resData);
                })
                .catch((err) => {
                    console.log('logOut 에러 응답 : ', resData);

                    res.send(err);
                });
        } else {
            res.send(error.unauthenticated());
        }
    });
    // access token 유효기간 확인
    router.get('/api/auth/confirmtoken', (req, res) => {
        let reqHeader = req.headers.authorization;
        console.log('----------------------', reqHeader);
        if (reqHeader !== undefined) {
            let bearer = reqHeader.split(' ');
            let accessToken = bearer[1];
            let decoded = handler(accessToken);
            decoded
                .then((data) => {
                    console.log('confirmToken 응답 : ', data);
                    res.send(data);
                })
                .catch((err) => {
                    console.log('confirmToken 에러응답 : ', err);
                    res.send(err);
                });
        }
    });
    //refresh 토큰으로 access token 갱신
    router.get('/api/auth/newtoken', (req, res) => {
        let reqHeader = req.headers.authorization;
        console.log('----------------------', reqHeader);
        if (reqHeader !== undefined) {
            let bearer = reqHeader.split(' ');
            let refreshToken = bearer[1];
            let response = authAdapter.issueNewToken(refreshToken);
            response
                .then((resData) => {
                    console.log('newtoken 응답 : ', resData);
                    res.send(resData);
                })
                .catch((err) => {
                    console.log('newtoken 에러 응답 : ', resData);

                    res.send(err);
                });
        } else {
            res.send(error.unauthenticated());
        }
    });

    router.get('/api/user', (req, res) => {
        console.log('user 요청 : ', req.body, req.headers);
        res.send('OK');
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
