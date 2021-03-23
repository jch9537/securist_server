//TODO logout- login usecase layer 예외처리(유효성) 추가확인
//TODO token 미들웨어 코드 정리
const {
    confirmToken,
    extractToken,
    getUserInfoByToken,
} = require('../../middleware');

const { authAdapter } = require('../../../adapters/inbound');
const { success, error } = require('../../exceptions/index');

module.exports = (router) => {
    router.post('/api/auth/checkemail', (req, res) => {
        let email = req.body.email;
        console.log('checkemail 요청 : ', email);
        let response = authAdapter.findUserByEmail(email);
        response
            .then((resData) => {
                console.log('checkemail 응답 : ', resData);
                res.send(resData);
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
                console.log('login 에러 응답 : ', err);
                res.send(err);
            });
    });
    router.post('/api/auth/logout', async (req, res) => {
        try {
            let accessToken = extractToken(req);
            let result = await confirmToken(accessToken);
            if (result.isValid) {
                let response = await authAdapter.logOut(accessToken);
                console.log('logOut 응답 : ', response);
                res.send(response);
            }
        } catch (err) {
            console.log('logOut 에러 응답 : ', err);
            res.send(err);
        }
        // let reqHeader = req.headers.authorization;
        // if (reqHeader !== undefined) {
        //     let token = reqHeader.split(' ')[1];
        //     console.log('logOut 요청 : ', token);
        //     let response = authAdapter.logOut(token);
        //     response
        //         .then((resData) => {
        //             console.log('logOut 응답 : ', resData);
        //             res.send(resData);
        //         })
        //         .catch((err) => {
        //             console.log('logOut 에러 응답 : ', resData);

        //             res.send(err);
        //         });
        // } else {
        //     res.send(error.unauthenticated());
        // }
    });
    // access token 유효기간 확인
    router.get('/api/auth/confirmtoken', async (req, res) => {
        try {
            let accessToken = extractToken(req);
            let result = await confirmToken(accessToken);
            console.log('result : ', result);
            res.send(result);
        } catch (err) {
            console.log('err : ', err);
            res.send(err);
        }

        // let reqHeader = req.headers.authorization;
        // console.log('----------------------', reqHeader);
        // if (reqHeader !== undefined) {
        //     let accessToken = reqHeader.split(' ')[1];
        //     let checkToken = confirmToken(accessToken);
        //     checkToken
        //         .then((data) => {
        //             console.log('confirmToken 응답 : ', data);
        //             res.send(data);
        //         })
        //         .catch((err) => {
        //             console.log('confirmToken 에러응답 : ', err);
        //             res.send(err);
        //         });
        // } else {
        //     res.send(error.unauthenticated());
        // }
    });
    //refresh 토큰으로 access token 갱신
    router.get('/api/auth/newtoken', async (req, res) => {
        try {
            let refreshToken = extractToken(req);
            let result = await authAdapter.issueNewToken(refreshToken);
            console.log('newtoken 응답 : ', result);
            res.send(result);
        } catch (err) {
            console.log('newtoken 에러 응답 : ', err);
            res.send(err);
        }
        // let reqHeader = req.headers.authorization;
        // console.log('----------------------', reqHeader);
        // if (!reqHeader) {
        //     let refreshToken = reqHeader.split(' ')[1];

        //     response
        //         .then((resData) => {
        //             console.log('newtoken 응답 : ', resData);
        //             res.send(resData);
        //         })
        //         .catch((err) => {
        //             console.log('newtoken 에러 응답 : ', resData);

        //             res.send(err);
        //         });
        // } else {
        //     res.send(error.unauthenticated());
        // }
    });

    router.get('/api/user', async (req, res) => {
        console.log('user 요청 : ', req.body, req.headers);
        try {
            let idToken = extractToken(req);
            let result = await getUserInfoByToken(idToken);
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
