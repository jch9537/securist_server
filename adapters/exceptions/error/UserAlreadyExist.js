module.exports = class {
    constructor(err) {
        this.status = 409;
        this.message = '이미 가입된 email입니다.(Conflict)';
        this.data = err;
    }
};
