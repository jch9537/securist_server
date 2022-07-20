const { AuthEntity } = require('../../entities');
//로그인
module.exports = class LogIn {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(logInData) {
        try {
            let authEntity = new AuthEntity(logInData);

            let loginInfo = await this.auth.logIn(authEntity);
            return loginInfo;
        } catch (error) {
            throw error;
        }
    }
};

// module.exports = class {
//     constructor(auth) {
//         this.auth = auth;
//     }
//     async excute(logInData) {
//         let result, response;
//         try {
//             let userEntity = new UserEntity(logInData);

//             response = await this.auth.logIn(userEntity);

//             result = {
//                 message: '로그인 완료',
//                 data: response,
//             };
//             return result;
//         } catch (error) {
//             console.error(error);
//             if (error.authServiceErrorName === 'NotAuthorizedException') {
//                 if (error.message === 'Incorrect username or password.') {
//                     error.message = 'email 또는 비밀번호가 맞지 않습니다.';
//                     error.data = {
//                         logInFailCount: error.errStack.failCount,
//                     };
//                 } else if (
//                     error.message === 'Password attempts exceeded'
//                     // cognito 기본 로그인 횟수제한 (5번, 이후 시도 시마다 1초~15분까지 두배로 시도 시간 증가)
//                     //이 에러 발생하면 비밀번호 찾기로 이동처리
//                 ) {
//                     error.message =
//                         '로그인 시도 횟수 초과. 비밀번호 찾기를 해주세요';
//                 } else if (error.message === 'User is disabled.') {
//                     error.message = '이용이 제한된 사용자 입니다.';
//                 }
//             } else if (
//                 error.authServiceErrorName == 'UserNotConfirmedException'
//             ) {
//                 error.message = '회원가입 확인 메일이 인증되지 않았습니다.';
//             } else {
//                 error.message = '로그인 실패';
//             }
//             throw error;
//         }
//     }
// };
/*
로그인 시도 잠금 필요 data
 LOGIN_FAIL_COUNT : 로그인 실패 횟수
 IS_LOCK : 로그인 시도 제한 여부 Y, N으로 저장
 LATEST_TRY_LOGIN_DATE : 최근 접속 시도 시각
 LOCK_COUNT : 로그인 시도 제한 횟수
 */
//    /*추가할 예외처리
//                         ResourceNotFoundException
//                         */
//                         if (error.code === 'InvalidParameterException') {
//                             reject(
//                                 new AuthServiceError(
//                                     error.message,
//                                     error.statusCode,
//                                     error.code,
//                                     error
//                                 )
//                             );
//                         } else if (error.code === 'UserNotConfirmedException') {
//                             reject(
//                                 new AuthServiceError(
//                                     error.message,
//                                     error.statusCode,
//                                     error.code,
//                                     error
//                                 )
//                             );
//                         } else if (error.code === 'NotAuthorizedException') {
//                             if (
//                                 error.message ===
//                                 'Incorrect username or password.'
//                             ) {
//                                 try {
//                                     let failCount = await self.getRetryCount(
//                                         email
//                                     );
//                                     failCount += 1;
//                                     await self.setRetryCount(email, failCount);
//                                     error.retryCount = failCount;
//                                     reject(
//                                         new AuthServiceError(
//                                             error.message,
//                                             error.statusCode,
//                                             error
//                                         )
//                                     );
//                                 } catch (error) {
//                                     reject(
//                                         new AuthServiceError(
//                                             error.message,
//                                             error.statusCode,
//                                             error
//                                         )
//                                     );
//                                 }
//                             } else if (
//                                 error.message === 'Password attempts exceeded'
//                                 // cognito 기본 로그인 횟수제한 (5번, 이후 시도 시마다 1초~15분까지 두배로 시도 시간 증가)
//                                 //이 에러 발생하면 비밀번호 찾기로 이동처리
//                             ) {
//                                 reject(
//                                     new AuthServiceError(
//                                         error.message,
//                                         error.statusCode,
//                                         error.code,
//                                         error
//                                     )
//                                 );
//                             } else if (error.message === 'User is disabled.') {
//                                 reject(
//                                     new AuthServiceError(
//                                         error.message,
//                                         error.statusCode,
//                                         error.code,
//                                         error
//                                     )
//                                 );
//                             }
//                         } else {
//                             reject(
//                                 new AuthServiceError(
//                                     error.message,
//                                     error.statusCode,
//                                     error.code,
//                                     error
//                                 )
//                             );
//                         }
