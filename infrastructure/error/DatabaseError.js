module.exports = class {
    constructor(code, errno, errMessage, errStack, errSql) {
        this.code = code;
        this.errno = errno;
        this.errMessage = errMessage;
        this.errStack = errStack;
        this.errSql = errSql;
    }
};
// 개발 후 code 와 message를 제외한 다른 건 지우기!
