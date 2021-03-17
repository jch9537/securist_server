const UserNotExist = require('./IncorrectPassword');
const ConfirmAuthMail = require('./ConfirmAuthMail');
const DisabledUser = require('./DisabledUser');
const UserAlreadyExist = require('./UserAlreadyExist');
const InvalidPassword = require('./InvalidPassword');
const InvalidParameter = require('./InvalidParameter');
const AccessTokenExpired = require('./AccessTokenExpired');
const InvalidAccessToken = require('./InvalidAccessToken');
const ExceededLogInCount = require('./ExceededLogInCount');

module.exports = {
    incorrectPassword(err) {
        return new UserNotExist(err);
    },
    confirmAuthMail(err) {
        return new ConfirmAuthMail(err);
    },
    disabledUser(err) {
        return new DisabledUser(err);
    },
    userAlreadyExist(err) {
        return new UserAlreadyExist(err);
    },
    invalidPassword(err) {
        return new InvalidPassword(err);
    },
    invalidParameter(err) {
        return new InvalidParameter(err);
    },
    accessTokenExpired(err) {
        return new AccessTokenExpired(err);
    },
    invalidAccessToken(err) {
        return new InvalidAccessToken(err);
    },
    exceededLogInCount(err) {
        return new ExceededLogInCount(err);
    },
};

// userNotExist: {
//     status: 404,
//     message: '존재하지 않는 email입니다.(Not Found)',
// },
// notMatchedPassword: {
//     status: 401,
//     message: '비밀번호를 확인해주세요 (Unauthenticated)',
// },
// unauthenticatedAccount: {
//     status: 401,
//     message:
//         '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요(Unauthenticated)',
// },
// disabledAccount: {
//     status: 403,
//     message:
//         '계정 비활성화 상태입니다. 관리자에게 문의해주세요(Unauthorization)',
// },
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
