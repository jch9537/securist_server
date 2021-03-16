module.exports = class {
    constructor(state) {
        this.status = 204;
        this.message = '사용 가능한 email입니다.';
        this.enabled = state;
    }
};
