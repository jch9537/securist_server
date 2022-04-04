module.exports = class {
    constructor(paramType, code = 400) {
        this.code = code;
        this.message = `유효하지 않은 ${paramType}입니다.`;
    }
};
