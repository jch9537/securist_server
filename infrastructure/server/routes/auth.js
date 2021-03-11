const { authAdaptor } = require('../../../adapters/inbound');

module.exports = (router) => {
    router.post('/checkDuplicateEmail', (req, res) => {
        let email = req.body.email;
        let response = authAdaptor.checkDuplicateEmail(email);
        response.then((resData) =>
            resData
                ? res.send('이미 가입된 email입니다.')
                : res.send('사용 가능한 email입니다.')
        );
    });
    router.post('/signUp', (req, res) => {
        let reqData = req.body;
        console.log('signUp 요청 : ', reqData);
        let response = authAdaptor.signUp(reqData);
        response.then((resData) =>
            resData ? res.send('회원 가입 성공') : res.send('회원 가입 실패')
        );
    });
    router.post('/logIn', (req, res) => {});
    router.post('/signOut', (req, res) => {});
    //테스트 삭제
    router.post('/deleteUserByAdmin', (req, res) => {
        let reqData = req.body;
        console.log('signUp 요청 : ', reqData);
        let response = authAdaptor.deleteUser(reqData);
        response.then((resData) => {
            console.log('signUp 응답 : ', resData);
            res.send(resData);
        });
    });
};
