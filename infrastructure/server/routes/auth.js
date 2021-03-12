const { authAdapter } = require('../../../adapters/inbound');

module.exports = (router) => {
    router.post('/checkemail', (req, res) => {
        let email = req.body.email;
        let response = authAdapter.checkDuplicateEmail(email);
        response.then((resData) =>
            resData
                ? res.send('이미 가입된 email입니다.')
                : res.send('사용 가능한 email입니다.')
        );
    });
    router.post('/signup', (req, res) => {
        let reqData = req.body;
        console.log('signup 요청 : ', reqData);
        let response = authAdapter.signUp(reqData);
        response.then((resData) =>
            resData ? res.send('회원 가입 성공') : res.send('회원 가입 실패')
        );
    });
    router.post('/login', (req, res) => {});
    router.post('/logout', (req, res) => {});
    //테스트용 회원 삭제
    router.post('/deleteUserByAdmin', (req, res) => {
        let reqData = req.body;
        console.log('signup 요청 : ', reqData);
        let response = authAdapter.deleteUser(reqData);
        response.then((resData) => {
            console.log('signup 응답 : ', resData);
            resData.statusCode === 400
                ? res.send('삭제할 회원이 존재하지 않습니다')
                : res.send('회원 삭제 성공');
        });
    });
};
