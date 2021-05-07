module.exports = class {
    constructor(paramType) {
        this.code = 403;
        this.message = `${paramType} 접근 권한이 없습니다.`;
        this.data = { authorization: false };
    }
};
