module.exports = class {
    constructor() {
        this.code = 403;
        this.message = `접근 인증되지 않은 서비스 입니다.`;
        this.data = { serviceAuthentication: false };
    }
};
