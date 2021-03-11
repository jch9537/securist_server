// signup, login, logout 어댑터
const { Auth, Repository, SendMail } = require('../outbound');
const {
    UserEntity,
    SignUp,
    CheckDuplicateId,
    CheckDuplicateEmail,
} = require('../../domain/user');
const { signUp, checkDuplicateEmail } = require('../outbound/auth');

const awsCognito = require('../../infrastructure/webService/authService/awsCognito');
const user = require('../../domain/user');

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
            return result;
        } catch (err) {
            return err;
        }
    },
    // 회원가입
    async signUp(userParam) {
        try {
            let result;
            // 기가입자 확인
            duplicatedUser = await this.checkDuplicateEmail(userParam.email);
            if (!duplicatedUser) {
                let signUp = new SignUp(Auth);
                // 회원가입 > 자동 메일발송
                result = await signUp.excute(userParam); //client에서 작성된 정보만 받음
                console.log(
                    '응답 > adapters > inbound > authAdaptor.js > signUp - result : ',
                    result
                );
                return result ? true : false;
            } else {
                return false;
            }
        } catch (err) {
            return err;
        }
    },
    // // 회원가입 확인 메일 발송 - 필요없음
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

    // 회원삭제

    async deleteUser(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.deleteUserByAdmin(userParam.id);

            return result;
        } catch (err) {
            return err;
        }
    },
};
