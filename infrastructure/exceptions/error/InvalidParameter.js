module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 400;
        this.message = 'parameter에 잘못된 데이터가 있습니다..(Bad Request)';
        this.data = err;
    }
};
