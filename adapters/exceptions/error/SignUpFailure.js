module.exports = class {
    constructor(data) {
        // console.log('--------------', resData);
        this.status = 400;
        this.message = '회원 가입 실패(Bad Request)';
        this.data = data;
    }
};
