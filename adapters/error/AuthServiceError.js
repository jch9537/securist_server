// Cogntio 에러
module.exports = class AuthServiceError extends Error {
    constructor(message, data) {
        super();
        // 로그용 데이터
        this.message = message; // 에러 로그 처리 메세지 : 원래 에러 메세지
        this.location = 'AuthService'; // 에러 발생 위치 : 로그 확인용 에러 메세지
        // 클라이언트 응답 데이터
        this.statusCode = this.setStatusCode(message);
        this.errMessage = this.setErrMessage(message); // 클라이언트 에러 응답 메세지
        this.data = data;
    }
    // 에러 메세지에 따라 응답 코드 지정
    setStatusCode(message) {
        let statusCode;
        console.log('AuthServiceError 에러 메세지 : ', message);
        switch (message) {
            case 'Invalid session for the user, session is expired.': // 최초 로그인 세션 만료
                statusCode = 401;
                break;
            case 'Incorrect username or password.':
                statusCode = 401;
                break;
            case 'Password attempts exceeded':
                statusCode = 401;
                break;
            case 'Attempt limit exceeded, please try after some time.':
                statusCode = 401;
                break;
            case 'User does not exist.':
                statusCode = 404;
                break;
            case 'An account with the given email already exists.':
                statusCode = 409;
                break;
            case 'Invalid verification code provided, please try again.':
                statusCode = 401;
                break;
            case 'Access Token has expired':
                statusCode = 401;
                break;
            case 'jwt expired':
                statusCode = 401;
                break;
            case 'Invalid Access Token':
                statusCode = 401;
                break;
            case 'Could not verify signature for Access Token':
                statusCode = 401;
                break;
            case 'Invalid Refresh Token':
                statusCode = 401;
                break;
            case 'requested token is invalid':
                statusCode = 401;
                break;
            case 'claim made for unknown kid':
                statusCode = 401;
                break;
            case 'claim issuer is invalid':
                statusCode = 401;
                break;
            case 'claim use is not access':
                statusCode = 401;
                break;
            default:
                statusCode = 500;
        }
        return statusCode;
    }
    // 에러 메세지에 따라 응답 메세지 지정
    setErrMessage(message) {
        let errMessage;
        switch (message) {
            case 'Invalid session for the user, session is expired.': // 최초 로그인 세션 만료
                errMessage = 'Login session is expired';
                break;
            case 'Incorrect username or password.': // 잘못된 비밀번호
                errMessage = 'Incorrect username or password.';
                break;
            case 'Password attempts exceeded': // 비밀번호 시도 횟수 초과
                errMessage = 'Password attempts exceeded';
                break;
            case 'Attempt limit exceeded, please try after some time.': // 시도 횟수 초과
                errMessage = 'Attempt limit exceeded';
                break;
            case 'User does not exist.': // 존재하지 않은 사용자
                errMessage = 'User does not exist.';
                break;
            case 'An account with the given email already exists.': // 등록되지 않은 email
                errMessage = 'Already exist';
                break;
            case 'Invalid verification code provided, please try again.': // 잘못된 확인코드
                errMessage = 'Invalid verification code ';
                break;
            case 'Access Token has expired': // access token 만료
                errMessage = 'Token expired';
                break;
            case 'jwt expired':
                errMessage = 'Token expired';
                break;
            case 'Invalid Access Token': // 잘못된 access token
                errMessage = 'Not authentication';
                break;
            case 'Could not verify signature for Access Token': // 잘못된 access token
                errMessage = 'Not authentication';
                break;
            case 'Invalid Refresh Token': // 잘못된 referesh token
                errMessage = 'Not authentication';
                break;
            case 'requested token is invalid': // 잘못된 token
                errMessage = 'Not authentication';
                break;
            case 'claim made for unknown kid': // token 확인 오류
                errMessage = 'Not authentication';
                break;
            case 'claim issuer is invalid': // token 확인 오류
                errMessage = 'Not authentication';
                break;
            case 'claim use is not access': // token 확인 오류 : 엑세스 권한 없음
                errMessage = 'Not authentication';
                break;
            default:
                errMessage = undefined;
        }
        return errMessage;
    }
};

/* default로 처리되는 메세지
 Invalid session provided // 최초 비번 변경시 세션값이 맞지 않은 경우
 Attempt limit exceeded, please try after some time.
 A client attempted to write unauthorized attribute
 Cannot reset password for the user as there is no registered/verified email or phone number : 이메일 확인이 되지 않은 채 요청 : email_verified true 속성 추가하지 않은 경우
 Attempt limit exceeded, please try after some time. : 비밀번호 찾기 시도횟수 초과
*/
