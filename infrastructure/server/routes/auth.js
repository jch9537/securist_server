//TODO logout- refresh 토큰 처리, login 추가확인 처리
const { authAdapter } = require('../../../adapters/inbound');

module.exports = (router) => {
    router.post('/api/auth/checkemail', (req, res) => {
        let email = req.body.email;
        let response = authAdapter.checkDuplicateEmail(email);
        response.then((resData) =>
            resData
                ? res.send('이미 가입된 email입니다.')
                : res.send('사용 가능한 email입니다.')
        );
    });
    router.post('/api/auth//signup', (req, res) => {
        let reqData = req.body;
        console.log('signup 요청 : ', reqData);
        let response = authAdapter.signUp(reqData);
        response.then((resData) =>
            resData ? res.send('회원 가입 성공') : res.send('회원 가입 실패')
        );
    });
    // login을 post로 처리했지만 추후 https로 하여 get으로 처리할 예정
    router.post('/api/auth//login', (req, res) => {
        let reqData = req.body;
        console.log('login 요청 : ', reqData);
        let response = authAdapter.logIn(reqData);
        response.then((resData) => {
            console.log('login 응답 : ', resData);
            if (resData.code === 'UserNotConfirmedException') {
                res.send(
                    '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요'
                );
            }
            res.send({ status: 200, message: '로그인 성공', data: resData });
        });
    });
    router.post('/api/auth//logout', (req, res) => {
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
    router.post('/api/auth/renewal', (req, res) => {
        let reqHeader = req.headers;
    });

    //테스트용 회원 삭제
    router.post('api/auth//deleteUserByAdmin', (req, res) => {
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
};
