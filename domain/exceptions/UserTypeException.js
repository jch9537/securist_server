module.exports = class {
    constructor(paramType, code = 403) {
        this.code = code;
        this.message = `${paramType} 에러.`;
    }
};
