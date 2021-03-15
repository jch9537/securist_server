//TODO logout- refresh 토큰 처리, login 추가확인 처리
const { authAdapter } = require('../../../adapters/inbound');
const { success, error } = require('../../../adapters/exceptions');

module.exports = (router) => {
    router.post('/api/auth/checkemail', (req, res) => {
        let email = req.body.email;
        console.log('checkemail 요청 : ', email);
        let response = authAdapter.findUserByEmail(email);
        response
            .then((resData) => {
                res.send(resData)
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
            .then((resData) =>
                resData
                    ? res.send('회원 가입 성공')
                    : res.send('회원 가입 실패')
            )
            .catch((err) => res.send(err));
    });
    // login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
    router.post('/api/auth/login', (req, res) => {
        let reqData = req.body;
        console.log('login 요청 : ', reqData);
        let response = authAdapter.logIn(reqData);
        response
            .then((resData) => {
                console.log('login 응답 : ', resData);
                res.send(resData);
                // if (resData === false) {
                //     res.send({
                //         status: 404,
                //         message: '아이디가 존재하지 않습니다',
                //     });
                // } else {
                //     if (resData.code === 'NotAuthorizedException') {
                //         //로그인 실패 횟수 +1
                //         res.send({
                //             status: 401,
                //             message:
                //                 '비밀번호를 확인해주세요 (Unauthenticated)',
                //         });
                //     } else {
                //         if (resData.code === 'UserNotConfirmedException') {
                //             res.send({
                //                 status: 401,
                //                 message:
                //                     '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요(Unauthenticated)',
                //             });
                //         } else {
                //             if (!resData.Users[0].Enabled) {
                //                 res.send({
                //                     status: 403,
                //                     message:
                //                         '계정 비활성화 상태입니다. 관리자에게 문의해주세요',
                //                 });
                //             }
                //         }
                //     }
                // }
                // res.send({
                //     status: 200,
                //     message: '로그인 성공',
                //     data: resData,
                // });
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
            response.then((resData) => {
                console.log('logOut 응답 : ', resData);
                if (resData.code === 'NotAuthorizedException') {
                    res.send({
                        status: 401,
                        message:
                            '토큰 사용 기간이 만료되었습니다.(Unauthorized)',
                    });
                }
            });
        } else {
            res.send({
                status: 403,
                message: '사용 권한이 없습니다(Forbidden)',
            });
        }
    });
    // access token 갱신
    router.post('/api/auth/renewal', (req, res) => {
        let reqHeader = req.headers;
    });

    //테스트용 회원 삭제
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
};
