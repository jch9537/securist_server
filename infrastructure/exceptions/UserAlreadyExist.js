module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 409;
        this.message = '이미 가입된 email입니다.(Conflict)';
        this.data = err;
    }
};
