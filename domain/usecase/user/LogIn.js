const { LogInEntity } = require('../../entities/user');
//로그인
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, password }) {
        let logInEntity = new LogInEntity({ email, password });
        let result = await this.Auth.logIn(logInEntity);
        return result;
    }
};
/*
로그인 시도 잠금 필요 data
 LOGIN_FAIL_COUNT : 로그인 실패 횟수
 IS_LOCK : 로그인 시도 제한 여부 Y, N으로 저장
 LATEST_TRY_LOGIN_DATE : 최근 접속 시도 시각
 LOCK_COUNT : 로그인 시도 제한 횟수
 */
