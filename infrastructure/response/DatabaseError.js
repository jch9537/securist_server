module.exports = class {
    constructor(errMessage, errno, errSql, errCode = 500) {
        this.message = errMessage;
        this.errorNum = errno;
        this.errSql = errSql;
        this.code = errCode;
    }
};
// module.exports = class {
//     constructor(errMessage, code = 500) {
//         this.message = errMessage;
//         this.code = code;
//     }
// };

// // 개발 후 code 와 message를 제외한 다른 건 지우기!
