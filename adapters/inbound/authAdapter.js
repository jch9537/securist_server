// 테스트용 사용자 삭제 import
const awsCognito = require('../../infrastructure/webService/authService/awsCognito');

// signup, login, logout 어댑터
const { Auth, SendMail } = require('../outbound');
const {
    UserEntity,
    CheckDuplicateEmail,
    SignUp,
    SignIn,
} = require('../../domain/user');
// const { signUp, checkDuplicateEmail } = require('../outbound/auth');

module.exports = {
    //Email 중복체크
    async checkDuplicateEmail(email) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - email : ', email );
        try {
            let result = await Auth.checkDuplicateEmail(email);
            console.log('응답 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - email : ', result);
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
                console.log('응답 > adapters > inbound > authAdaptor.js > signUp - result : ', result);
                // 회원가입이 완료되면 기업정보 생성 (코드 추가!!)
                return result ? true : false;
            } else {
                return false;
            }
        } catch (err) {
            return err;
        }
    },
    logIn(userParam) {
        console.log('요청 > adapters > inbound > authAdaptor.js > logIn - userParam : ', userParam);
        try {
            /* 로그인 확인 흐름
            1. 아이디 존재 확인 ? next : '아이디가 존재하지 않습니다' 
            2. 존재하는 아이디와 비밀번호 일치 확인 ? next : '비밀번호를 확인해주세요'
            3. 계정인증 상태 확인 (이메일 인증여부) ? next : '이메일 계정확인 후 로그인 가능합니다'
            4. 로그인 잠금상태 확인 (활성/비활성) ? next : 
               5회이상 로그인 실패  ? 10분 뒤 재시도 또는 비밀번호찾기안내 : '계정이 잠금상태입니다. 관리자에게 문의해주세요' 
            5. 비밀번호 유효기간 초과 ? 비밀번호 변경 모달 노출 : 로그인

            */
        } catch (err) {}
    },
    findUserByEmail(email) {
        console.log('요청 > adapters > inbound > authAdaptor.js > findUserByEmail - email : ', email );
        try{
            console.log('응답 > adapters > inbound > authAdaptor.js > signUp - result : ', result);
        }catch(err){}
    },
    // // 메일 발송
    // async sendMail(email) {
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
