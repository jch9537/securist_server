module.exports = class ErrorResponse {
    constructor(
        code = 500,
        message = 'Internal Server Error',
        data = undefined
    ) {
        this.error = {
            code: code,
            // code: code === 400 ? 500 : code, // 상태코드
            message: message, // 에러 메세지
            data: data,
        };
    }
};

// module.exports = class {
//     constructor(message, data, name) {
//         this.errMessage = message;
//         this.errData = data;
//         this.errName = name;
//     }
// };
