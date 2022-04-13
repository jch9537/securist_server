// ** this.message = 에러 로그 처리 메세지
// ** this.errMessage = 클라이언트 응답 메세지

// 메일 발송 에러
module.exports = class EmailServiceError extends Error {
    constructor(message, detail) {
        super();
        // 로그용 데이터
        this.message = message; // 메세지
        this.detail = detail; // 원래 에러
        this.location = 'EmailService'; // 에러 발생 위치 : 로그
        // 클라이언트 응답 데이터
        this.statusCode = 500;
        this.errMessage = 'Email sending error';
        // this.name = 'DatabaseError'; // 에러명
    }
};

// module.exports = class {
//     constructor(errMessage, errno, errStack, errSql) {
//         this.stausCode = 500;
//         this.errMessage = errMessage;
//         this.errno = errno;
//         this.errStack = errStack;
//         this.errSql = errSql;
//     }
// };
