// 저장서비스(S3) 오류
module.exports = class StorageServiceError extends Error {
    constructor(message, data) {
        super();
        // 로그용 데이터
        this.message = message; // 에러 로그 처리 메세지 : 원래 에러 메세지
        this.location = 'StorageService'; // 에러 발생 위치 : 로그 확인용 에러 메세지
        // 클라이언트 응답 데이터
        this.statusCode = this.setStatusCode(message);
        this.errMessage = this.setErrMessage(message); // 클라이언트 에러 응답 메세지
        this.data = data;
    }
    // 에러 메세지에 따라 응답 코드 지정
    setStatusCode(message) {
        let statusCode;
        console.log('StorageServiceError 에러 메세지 : ', message);
        switch (message) {
            // case 'Incorrect username or password.':
            //     statusCode = 401;
            //     break;
            default:
                statusCode = 500;
        }
        return statusCode;
    }
    // 에러 메세지에 따라 응답 메세지 지정
    setErrMessage(message) {
        let errMessage;
        switch (message) {
            // case 'Incorrect username or password.':
            //     errMessage = 'Incorrect username or password.';
            //     break;
            default:
                errMessage = 'Storage service error';
        }
        return errMessage;
    }
};

/* default로 처리되는 메세지
 Invalid session provided
 Attempt limit exceeded, please try after some time.
 A client attempted to write unauthorized attribute
 Cannot reset password for the user as there is no registered/verified email or phone number : 이메일 확인이 되지 않은 채 요청 : email_verified true 속성 추가하지 않은 경우
 Attempt limit exceeded, please try after some time. : 비밀번호 찾기 시도횟수 초과
*/
