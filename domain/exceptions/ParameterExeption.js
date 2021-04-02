module.exports = class {
    constructor(paramType) {
        this.code = 400;
        this.message = `유효하지 않은 ${paramType}입니다.`;
    }
};
