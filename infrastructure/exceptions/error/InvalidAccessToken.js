module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 401;
        this.message = '유효하지 않은 토큰입니다. (Unauthenticated)';
        this.logInRequired = true;
        this.err = err;
    }
};
