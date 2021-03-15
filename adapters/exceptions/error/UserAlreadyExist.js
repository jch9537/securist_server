module.exports = class {
    constructor(state) {
        // console.log('--------------', resData);
        this.status = 409;
        this.message = '이미 가입된 email입니다.(Conflict)';
        this.enabled = state;
    }
};
