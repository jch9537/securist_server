// TODO 확인할 것 : 확인코드의 validation의 필요성에 대해 - 알면안되는 확인코드에 대한 힌트를 줄 수 있지 않나?
// TODO signUp에 Repository가 아닌 inbound adapter를 넘겨보기 시도
const awsCognito = require('../../infrastructure/webService/authService/awsCognito'); // 테스트용 모듈 import

// 사용자 처리 어댑터
const { Auth, Repository } = require('../outbound');

const {
    CheckDuplicateEmail,
    SignUp,
    LogIn,
    LogOut,
    ForgotPassword,
    ConfirmForgotPassword,
    ChangePassword,
    IssueNewToken,
    CheckAccessToken,
    GetUserByIdToken,
} = require('../../domain/usecase/auth');

module.exports = {
    //Email 중복체크, 사용자 중복확인
    async checkDuplicateEmail(email) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > checkDuplicateEmail - email : ',
            email
        );
        try {
            let checkDuplicateEmail = new CheckDuplicateEmail(Auth);
            let result = await checkDuplicateEmail.excute(email);
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
    async signUp(userParam) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > signUp - userParam : ',
            userParam
        );
        try {
            let signUp = new SignUp(Auth, Repository);
            let result = await signUp.excute(userParam); //client에서 작성된 정보만 받음
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > signUp - result : ',
                result
            );
            /* 
            회원가입이 완료되면 
            1. 타입(클/컨)별 사용자 정보 생성 (DB) 
            2. 기업정보가 있는지 확인 ? 연결 : 생성 (DB)
            */
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > signUp - err : ',
                err
            );
            throw err;
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
    async logIn(userParam) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > logIn - userParam : ',
            userParam
        );
        try {
            let logIn = new LogIn(Auth);
            let result = await logIn.excute(userParam);
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
    async logOut(token) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > logOut - token : ',
            token
        );
        try {
            let logOut = new LogOut(Auth);
            let result = await logOut.excute(token);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > logOut - result : ',
                result
            );
            return result;
        } catch (err) {
            throw err;
        }
    },
    // 사용자 비밀번호 수정
    //TODO : 비밀번호 수정일 현재 시점으로 수정
    async changePassword(userParam) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > changePassword - userParam : ',
            userParam
        );
        try {
            let changePassword = new ChangePassword(Auth);
            let result = await changePassword.excute(userParam);
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
    async forgotPassword(email) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > forgotPassword - email : ',
            email
        );
        try {
            let forgotPassword = new ForgotPassword(Auth);
            let result = await forgotPassword.excute(email);
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
    async confirmForgotPassword(userParam) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > confirmForgotPassword - email : ',
            userParam
        );
        try {
            let confirmForgotPassword = new ConfirmForgotPassword(Auth);
            let result = await confirmForgotPassword.excute(userParam);
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
    async checkAccessToken(token) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > checkAccessToken - token : ',
            token
        );
        try {
            let checkAccessToken = new CheckAccessToken(Auth);
            let result = await checkAccessToken.excute(token);
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
    // id 토큰으로 사용자 정보 가져오기
    async getUserByIdToken(idToken) {
        console.log(
            '요청 > adapters > inbound > authAdaptor.js > getUserByIdToken - idToken : ',
            idToken
        );
        try {
            let getUserByIdToken = new GetUserByIdToken(Auth);
            let result = await getUserByIdToken.excute(idToken);
            console.log(
                '응답 > adapters > inbound > authAdaptor.js > getUserByIdToken - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > authAdaptor.js > getUserByIdToken - result : ',
                err
            );
            throw err;
        }
    },

    // 테스트용 함수(cognito 바로 연결 : 관리자 권한 처리) -------------------------------------------------------------
    //accessToken확인
    async getUserInfo(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.getUserInfo(userParam);

            return result;
        } catch (err) {
            return err;
        }
    },
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
    async disableUser(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.disableUserByAdmin(userParam.id);
            return result;
        } catch (err) {
            return err;
        }
    },
    async enableUser(userParam) {
        try {
            var test = new awsCognito();
            let result = await test.enableUserByAdmin(userParam.id);
            return result;
        } catch (err) {
            return err;
        }
    },
};
