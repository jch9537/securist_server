module.exports = class {
    constructor(paramType, code = 404) {
        this.code = code;
        this.message = `${paramType}가 존재하지 않습니다.`;
    }
};
