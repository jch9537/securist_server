const Cognito = require('../../infrastructure/webService/authService/Cognito'); // 테스트용 모듈 import

// 사용자 처리 어댑터
const { auth, repository } = require('../outbound');
const {
    CheckExistUser,
    ResendSignUpEmail,
    SignUp,
    LogIn,
    LogOut,
    FindPassword,
    UpdateForgotPassword,
    ChangePassword,
    ReissueToken,
    VerifyUserByPassword,
    // CheckAccessToken,
} = require('../../domain/usecase/auth');

module.exports = class AuthAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }
    //Email 중복체크, 사용자 중복확인
    async checkExistUser(checkData) {
        try {
            let checkExistUser = new CheckExistUser(auth);
            let result = await checkExistUser.excute(checkData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 회원가입
    async signUp(signUpData) {
        try {
            let signUp = new SignUp(repository);
            let result = await signUp.excute(signUpData); //client에서 작성된 정보만 받음
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 가입메일 재발송
    async resendSignUpEmail(resendEmailData) {
        try {
            let resendSignUpEmail = new ResendSignUpEmail(auth);
            let result = await resendSignUpEmail.excute(resendEmailData);
            return result;
        } catch (erroror) {
            throw erroror;
        }
    }
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
        try {
            let logIn = new LogIn(auth);
            let result = await logIn.excute(logInData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 로그아웃
    async logOut(accessToken) {
        try {
            let logOut = new LogOut(auth);
            let result = await logOut.excute(accessToken);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자 비밀번호 수정
    async changePassword(updatePasswordData, accessToken) {
        try {
            let changePassword = new ChangePassword(auth);
            let result = await changePassword.excute(
                updatePasswordData,
                accessToken
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자 인증 : 비밀번호
    async verifyUserByPassword(verifyData) {
        try {
            let verifyUserByPassword = new VerifyUserByPassword(auth);
            let result = await verifyUserByPassword.excute(verifyData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 비밀번호 찾기 확인코드 전송
    async findPassword(findPasswordData) {
        try {
            let findPassword = new FindPassword(auth);
            let result = await findPassword.excute(findPasswordData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 비밀번호 찾기 비밀번호 변경
    async updateForgotPassword(changePasswordData) {
        try {
            let updateForgotPassword = new UpdateForgotPassword(auth);
            let result = await updateForgotPassword.excute(changePasswordData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // access 토큰 유효기간 확인
    async checkAccessToken(accessToken) {
        try {
            let checkAccessToken = new CheckAccessToken(auth);
            let result = await checkAccessToken.excute(accessToken);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // access 토큰 갱신
    async reissueToken(refreshToken) {
        try {
            let reissueToken = new ReissueToken(auth);
            let result = await reissueToken.excute(refreshToken);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // // 테스트용 함수(cognito 바로 연결 : 관리자 권한 처리) -------------------------------------------------------------

    // 회원삭제
    async deleteUserByAdmin(authData) {
        try {
            var test = new Cognito();
            let result = await test.deleteUserByAdmin(authData);

            return result;
        } catch (error) {
            return error;
        }
    }
    async disableUserByAdmin(userParam) {
        try {
            var test = new Cognito();
            let result = await test.disableUserByAdmin(userParam.id);
            return result;
        } catch (error) {
            return error;
        }
    }
    async enableUserByAdmin(userParam) {
        try {
            var test = new Cognito();
            let result = await test.enableUserByAdmin(userParam.id);
            return result;
        } catch (error) {
            return error;
        }
    }
};
