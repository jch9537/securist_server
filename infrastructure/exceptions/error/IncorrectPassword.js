module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 401;
        this.message = '비밀번호를 확인해주세요 (Unauthenticated)';
        this.data = err;
    }
};
