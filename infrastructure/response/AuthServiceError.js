module.exports = class {
    constructor(errMessage, errCode = 500, errName, err) {
        this.message = errMessage; // 에러 메세지
        this.code = errCode; // 상태 코드
        this.authServiceErrorName = errName; // 코그니토 에러코드 ex) code: 'CodeMismatchException'
        this.errStack = err; // 전체 에러
    }
};
