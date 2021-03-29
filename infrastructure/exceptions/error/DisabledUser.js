module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 403;
        this.message = '계정 비활성화 상태입니다. 관리자에게 문의해주세요';
        this.data = err;
    }
};
