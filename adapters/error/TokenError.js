// 토큰 에러
module.exports = class TokenError extends Error {
    constructor(message) {
        super();
        // 로그용 데이터
        this.message = message; // 에러 로그 처리 메세지 : 원래 에러 메세지
        this.location = 'Token'; // 에러 발생 위치 : 로그 확인용 에러 메세지
        // 클라이언트 응답 데이터
        this.statusCode = 401;
        this.errMessage = this.setErrMessage(message); // 클라이언트 에러 응답 메세지
    }
    setErrMessage(message) {
        let errMessage;
        switch (message) {
            case 'No token': // 토큰 없음
                errMessage = 'No token';
                break;
            case 'jwt must be provided':
                errMessage = 'No token';
                break;
            case 'jwt malformed':
                errMessage = 'No token';
                break;
            case 'jwt expired': // 토큰 만료 : 서버 간 토큰
                errMessage = 'Token expired';
                break;
            default:
                errMessage = 'Token error';
        }
        return errMessage;
    }
};
