module.exports = class {
    constructor(err) {
        this.status = 403;
        this.message = '토큰이 만료되었습니다. (Forbidden)';
        this.isExpired = true;
        this.err = err;
    }
};
