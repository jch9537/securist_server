// ** this.message = 에러 로그 처리 메세지
// ** this.errMessage = 클라이언트 응답 메세지

// 권한 오류
module.exports = class AuthenticationException extends Error {
    constructor(location) {
        super();
        // 로그용 데이터
        this.location = location || 'server';
        this.message = 'Not authentication';
        // 클라이언트 응답 데이터
        this.statusCode = 401;
        this.errMessage = 'Not authentication';
        // this.data = { authorization: false };
    }
};
