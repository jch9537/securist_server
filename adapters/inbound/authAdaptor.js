// signup, login, logout 어댑터
const { Auth, Repository, SendMail } = require('../outbound');
const {
    UserEntity,
    SignUp,
    CheckDuplicateId,
    CheckDuplicateEmail,
} = require('../../domain/user');
const { signUp } = require('../outbound/auth');

module.exports = {
    //Email 중복체크
    async checkDuplicateEmail(email) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - email : ',
            email
        );
        try {
            let result = await Auth.checkDuplicateEmail(email);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - email : ',
                result
            );
            if (result.Users.length) return '이미 가입된 email입니다.';
            return '사용가능한 email입니다.';
        } catch (err) {
            return err;
        }
    },
    // 회원가입
    // async signUp(userParam) {
    //     try {
    //         let result;
    //         let handler = new SignUp(Auth);
    //         let signUpResult = await handler.excute(userParam);
    //         if (signUpResult.User.email) {
    //             result = this.sendConfirmMail(signUpResult.User.email);
    //         }
    //         return result;
    //     } catch (err) {
    //         return err;
    //     }
    // },
    // 회원가입 확인 메일 발송
    // async sendConfirmMail(email) {
    //     try {
    //         let sendMailresult = await SendMail.sendConfirmMail(email);
    //         return sendMailresult;
    //     } catch (err) {
    //         return err;
    //     }
    // },
    // // 로그인
    // async signUp(userParam) {},
};
