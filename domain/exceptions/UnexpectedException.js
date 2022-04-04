module.exports = class {
    constructor(paramType, code = 500) {
        this.code = code;
        this.message = `서버 오류 : ${paramType} `;
    }
};
