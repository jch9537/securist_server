// ** this.message = 에러 로그 처리 메세지
// ** this.errMessage = 클라이언트 응답 메세지

// 유효성 오류
module.exports = class ValidationException extends Error {
    constructor(message) {
        super();
        // 로그용 데이터
        this.message = message;
        this.location = 'DTO'; // DTO에서만 유효성 체크하므로 location 고정
        // 클라이언트 응답 데이터
        this.statusCode = 400;
        this.name = 'ValidationException';
        this.errMessage = 'Bad Request';
    }
};
