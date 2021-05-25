// TODO 확인할 것 : 확인코드의 validation의 필요성에 대해 - 알면안되는 확인코드에 대한 힌트를 줄 수 있지 않나?
const awsCognito = require('../../infrastructure/webService/authService/awsCognito'); // 테스트용 모듈 import

// 사용자 처리 어댑터
const { Auth, Repository } = require('../outbound');

const {
    CheckDuplicateEmail,
    ResendComfirmEmail,
    SignUp,
    LogIn,
    LogOut,
    ForgotPassword,
    ConfirmForgotPassword,
    ChangePassword,
    IssueNewToken,
    CheckAccessToken,
    VerifyUserByPassword,
} = require('../../domain/usecase/auth');

module.exports = {
    //Email 중복체크, 사용자 중복확인
    async checkDuplicateEmail(checkData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - checkData : ',
            checkData
        );
        try {
            let checkDuplicateEmail = new CheckDuplicateEmail(Auth);
            let result = await checkDuplicateEmail.excute(checkData);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - result : ',
                result
            );

            let data = {
                userExist: result,
            };
            return data;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - err : ',
                err
            );
            throw err;
        }
    },
    // 회원가입
    async signUp(signUpData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > signUp - signUpData : ',
            signUpData
        );
        try {
            let signUp = new SignUp(Auth, Repository);
            let result = await signUp.excute(signUpData); //client에서 작성된 정보만 받음
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > signUp - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > signUp - err : ',
                err
            );
            throw err;
        }
    },
    // 가입메일 재발송
    async resendComfirmEmail(resendEmailData) {
        try {
            let resendComfirmEmail = new ResendComfirmEmail(Auth);
            let result = await resendComfirmEmail.excute(resendEmailData);

            return result;
        } catch (error) {
            throw error;
        }
    },
    // 로그인
    /* 로그인 확인 흐름
    1. 아이디 / 비밀번호 유효성 확인                                                       -  처리완료
    2. 아이디 존재 확인 ? next : '아이디가 존재하지 않습니다'                                - 처리완료
    3. 존재하는 아이디와 비밀번호 일치 확인 ? next : '비밀번호를 확인해주세요'                - 처리완료
    4. 계정인증 상태 확인 (이메일 인증여부) ? next : '이메일 계정확인 후 로그인 가능합니다'    - 처리완료
    5. 로그인 잠금상태 확인 (활성/비활성) ? 토큰 반환(로그인) :                              - 처리완료
       5회이상 로그인 실패  ?  비밀번호찾기안내 : '계정이 잠금상태입니다. 관리자에게 문의해주세요' - 처리완료
    6. 비밀번호 유효기간 초과 ? 비밀번호 변경 모달 노출 :  로그인 화면 리다이렉션              - 프런트 처리
    */
    async logIn(logInData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > logIn - logInData : ',
            logInData
        );
        try {
            let logIn = new LogIn(Auth);
            let result = await logIn.excute(logInData);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > logIn - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > logIn - err : ',
                err
            );
            throw err;
        }
    },
    // 로그아웃
    async logOut(accessToken) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > logOut - accessToken : ',
            accessToken
        );
        try {
            let logOut = new LogOut(Auth);
            let result = await logOut.excute(accessToken);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > logOut - result : ',
                result
            );
            return result;
        } catch (err) {
            throw err;
        }
    },
    // 사용자 인증 : 비밀번호
    async verifyUserByPassword(verifyData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > verifyUserByPassword - userParam : ',
            verifyData
        );
        try {
            let verifyUserByPassword = new VerifyUserByPassword(Auth);
            let result = await verifyUserByPassword.excute(verifyData);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > verifyUserByPassword - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > verifyUserByPassword - result : ',
                err
            );
            throw err;
        }
    },

    // 사용자 비밀번호 수정
    async changePassword(accessToken, updatePasswordData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > changePassword - userParam : ',
            accessToken,
            updatePasswordData
        );
        try {
            let changePassword = new ChangePassword(Auth);
            let result = await changePassword.excute(
                accessToken,
                updatePasswordData
            );
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > changePassword - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > changePassword - result : ',
                err
            );
            throw err;
        }
    },
    // 비밀번호 찾기 확인코드 전송
    async forgotPassword(forgotPasswordData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > forgotPassword - forgotPasswordData : ',
            forgotPasswordData
        );
        try {
            let forgotPassword = new ForgotPassword(Auth);
            let result = await forgotPassword.excute(forgotPasswordData);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > forgotPassword - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > forgotPassword - result : ',
                err
            );
            throw err;
        }
    },
    // 비밀번호 찾기 비밀번호 변경
    async confirmForgotPassword(changePasswordData) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > confirmForgotPassword - email : ',
            changePasswordData
        );
        try {
            let confirmForgotPassword = new ConfirmForgotPassword(Auth);
            let result = await confirmForgotPassword.excute(changePasswordData);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > confirmForgotPassword - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > confirmForgotPassword - result : ',
                err
            );
            throw err;
        }
    },
    // access 토큰 유효기간 확인
    async checkAccessToken(accessToken) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > checkAccessToken - accessToken : ',
            accessToken
        );
        try {
            let checkAccessToken = new CheckAccessToken(Auth);
            let result = await checkAccessToken.excute(accessToken);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > checkAccessToken - result : ',
                result
            );
            return result;
        } catch (err) {
            throw err;
        }
    },
    // access 토큰 갱신
    async issueNewToken(refreshToken) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > issueNewToken - refreshToken : ',
            refreshToken
        );
        try {
            let issueNewToken = new IssueNewToken(Auth);
            let result = await issueNewToken.excute(refreshToken);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > issueNewToken - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > issueNewToken - result : ',
                err
            );
            throw err;
        }
    },
    // 테스트용 함수(cognito 바로 연결 : 관리자 권한 처리) -------------------------------------------------------------

    // 회원삭제
    async deleteUserByAdmin(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.deleteUserByAdmin(userParam.id);

            return result;
        } catch (err) {
            return err;
        }
    },
    async disableUserByAdmin(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.disableUserByAdmin(userParam.id);
            return result;
        } catch (err) {
            return err;
        }
    },
    async enableUserByAdmin(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.enableUserByAdmin(userParam.id);
            return result;
        } catch (err) {
            return err;
        }
    },
};
