const UserNotExist = require('./UserNotExist');
const SignUpFailure = require('./SignUpFailure');
const Unauthenticated = require('./Unauthenticated');

module.exports = {
    userNotExist(err) {
        return new UserNotExist(err);
    },
    signUpFailure(data) {
        return new SignUpFailure(data);
    },
    unauthenticated() {
        return new Unauthenticated();
    },
};

// userNotExist: {
//     status: 404,
//     message: '존재하지 않는 email입니다.(Not Found)',
// },-------------------------------------------------
// notMatchedPassword: {
//     status: 401,
//     message: '비밀번호를 확인해주세요 (Unauthenticated)',
// },-----------------------------------------------------
// unauthenticatedAccount: {
//     status: 401,
//     message:
//         '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요(Unauthenticated)',
// },------------------------------------------------------------------------------------
// disabledAccount: {
//     status: 403,
//     message:
//         '계정 비활성화 상태입니다. 관리자에게 문의해주세요(Unauthorization)',
// },--------------------------------------------------------------------
// expiredToken: {
//     status: 401,
//     message: '토큰 사용 기간이 만료되었습니다.(Unauthorized)',
// },
// unAuthorization: {
//     status: 403,
//     message: '사용 권한이 없습니다(Forbidden)',
// },
// userNotFound: {
//     status: 404,
//     message: '삭제할 회원이 존재하지 않습니다(Not Found)',
// },
