module.exports = class {
    constructor(err) {
        // console.log('--------------', resData);
        this.status = 401;
        this.message =
            '로그인 시도횟수를 초과했습니다. 비밀번호 찾기 기능을 사용해주세요 (Unauthenticated)';
        this.data = err;
    }
};
