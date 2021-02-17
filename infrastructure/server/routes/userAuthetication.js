// 메서드 라우터 - 사용자
const { userAuthController } = require('../../../adapters/controllers');

module.exports = (router) => {
    router.post('/signup', (req, res) => {
        console.log(
            '------------------ test start > POST /signup : ---------------------------------------'
        );
        userAuthController.getUser(req, res);
    }); //Cognito 회원가입

    router.get('/checkEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /signup : ---------------------------------------'
        );
        userAuthController.verifyDuplicateEmail(req, res);
    }); // email 중복체크

    router.get('/checkBusinessNum', (req, res) => {
        console.log(
            '------------------ test start > GET /checkBusinessNum : ---------------------------------------'
        );
        userAuthController.checkBusinessNum(req, res);
    }); // 사업자번호 중복/유효여부 확인

    router.post('/sendCodeToEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /sendCodeToEmail : ---------------------------------------'
        );
        userAuthController.sendCode(req, res);
    }); // email 인증코드 발송

    router.post('/authEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /authEmail : ---------------------------------------'
        );
        userAuthController.authEmail(req, res);
    }); // email 인증코드 확인

    router.post('/sendCodePhone', (req, res) => {
        console.log(
            '------------------ test start > POST /sendCodePhone : ---------------------------------------'
        );
        userAuthController.sendCode(req, res);
    }); // 휴대폰 인증코드 발송

    router.post('/authPhoneNum', (req, res) => {
        console.log(
            '------------------ test start > POST /authPhoneNum : ---------------------------------------'
        );
        userAuthController.authEmail(req, res);
    }); // 휴대폰 인증코드 확인

    router.post('/login', (req, res) => {
        console.log(
            '------------------ test start > POST /login : ---------------------------------------'
        );
        userAuthController.login(req, res);
    }); // 로그인

    router.post('/findIdByEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /findIdByEmail : ---------------------------------------'
        );
        userAuthController.findIdByEmail(req, res);
    }); // 아이디 찾기(이메일)

    router.post('/findIdByPhone', (req, res) => {
        console.log(
            '------------------ test start > POST /findIdByPhone : ---------------------------------------'
        );
        userAuthController.findIdByPhone(req, res);
    }); // 아이디 찾기(휴대폰)

    router.post('/findPasswordByEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /findPasswordByEmail : ---------------------------------------'
        );
        userAuthController.findPasswordByEmail(req, res);
    }); // 비밀번호 찾기(이메일)

    router.post('/findPasswordByPhone', (req, res) => {
        console.log(
            '------------------ test start > POST /findPasswordByPhone : ---------------------------------------'
        );
        userAuthController.findPasswordByPhone(req, res);
    }); // 비밀번호 찾기(휴대폰)

    router.post('/logout', (req, res) => {
        console.log(
            '------------------ test start : POST /logout ---------------------------------------'
        );
        userAuthController.logout(req, res);
    }); // 로그아웃
};
