module.exports = class {
    constructor(paramType, code = 403) {
        this.code = code;
        this.message = `${paramType} 타입 에러.`;
    }
};
