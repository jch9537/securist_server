module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 400;
        this.message = '유효하지 않은 Password입니다.(Bad Request)';
        this.data = err;
    }
};
