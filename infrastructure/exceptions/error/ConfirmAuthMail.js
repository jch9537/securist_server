module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 401;
        this.message =
            '인증되지 않은 계정입니다. 발송된 메일 확인 후 인증 처리해주세요(Unauthenticated)';
        this.data = err;
    }
};
