module.exports = class {
    constructor(err) {
        this.status = 404;
        this.message = '존재하지 않는 사용자입니다.(Not Found)';
        this.exists = err;
    }
};
