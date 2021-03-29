module.exports = class {
    constructor(err) {
        this.status = 401;
        this.message =
            '토큰이 취소되었습니다. 로그인 서비스가 필요합니다.(Unauthorized)';
        this.logInRequired = true;
        this.err = err;
    }
};
