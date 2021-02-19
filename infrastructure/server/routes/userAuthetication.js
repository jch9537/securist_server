// 메서드 라우터 - 사용자
const { userAuthController } = require('../../../adapters/controllers');

module.exports = (router) => {
    router.post('/signupByAdmin', (req, res) => {
        console.log(
            '------------------ test start > POST /signupByAdmin : ---------------------------------------'
        );
        userAuthController.createUser(req, res);
    }); // Cognito 관리자 회원가입

    router.post('/signup', (req, res) => {
        console.log(
            '------------------ test start > POST /signup : ---------------------------------------'
        );
        userAuthController.signUp(req, res);
    }); //Cognito 사용자 회원가입

    router.get('/checkBusinessNum', (req, res) => {
        console.log(
            '------------------ test start > GET /checkBusinessNum : ---------------------------------------'
        );
        userAuthController.checkBusinessNum(req, res);
    }); // 사업자번호 중복/유효여부 확인

    router.get('/checkEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /signup : ---------------------------------------'
        );
        userAuthController.verifyDuplicateEmail(req, res);
    }); // email 중복체크 - checkEmail과 sendCodeToEmail API 합치기

    router.post('/sendCodeToEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /sendCodeToEmail : ---------------------------------------'
        );
        userAuthController.sendCodeToEmail(req, res);
    }); // email 인증코드 발송

    router.post('/authEmail', (req, res) => {
        console.log(
            '------------------ test start > POST /authEmail : ---------------------------------------'
        );
        userAuthController.authEmail(req, res);
    }); // email 인증코드 확인

    router.post('/sendCodeToPhone', (req, res) => {
        console.log(
            '------------------ test start > POST /sendCodeToPhone : ---------------------------------------'
        );
        userAuthController.sendCodeToPhone(req, res);
    }); // 휴대폰번호 중복 확인 & 인증코드 발송 : 휴대폰 인증모듈사용

    router.post('/authPhoneNum', (req, res) => {
        console.log(
            '------------------ test start > POST /authPhoneNum : ---------------------------------------'
        );
        userAuthController.authPhoneNum(req, res);
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
    }); // 아이디 찾기(이메일) - email로 cognito 검색( /checkEmail과 동일 과정) 후 없는 계정일 경우 안내, 있는 계정일 경우 ses로 id 발송(controller의 sendmail메서드 추가)

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
    router.post('/deleteUserByAdmin', (req, res) => {
        console.log(
            '------------------ test start : POST /deleteUserByAdmin ---------------------------------------'
        );
        userAuthController.deleteUserByAdmin(req, res);
    }); // 관리자 회원 삭제
};
