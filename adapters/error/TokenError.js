//TODO : 자세한 처리 확인!!
// 토큰 에러
module.exports = class TokenError extends Error {
    constructor() {
        super();
        // 로그용 데이터
        this.message = 'No token'; // 에러 로그 처리 메세지 : 원래 에러 메세지
        this.location = 'Token'; // 에러 발생 위치 : 로그 확인용 에러 메세지
        // 클라이언트 응답 데이터
        this.statusCode = 401;
        this.errMessage = 'No token'; // 클라이언트 에러 응답 메세지
    }
};
