module.exports = class {
    constructor(paramType, code = 403) {
        this.message = `${paramType} 접근 권한이 없습니다.`;
        this.code = code;
        this.data = { isAuthorization: false };
    }
};
