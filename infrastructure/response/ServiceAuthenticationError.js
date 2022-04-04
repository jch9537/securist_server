module.exports = class {
    constructor(message, name, code = 401) {
        this.message = message;
        // this.message = `접근 인증되지 않은 서비스 입니다. : 서비스 로그인 실패`;
        this.data = { serviceAuthentication: false };
        this.name = name;
        this.code = code;
    }
};
