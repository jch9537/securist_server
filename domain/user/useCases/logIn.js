const UserEntity = require('../entity/userEntity');
//로그인
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, password }) {
        let userEntity = new UserEntity({ email, password });
        let validData = {
            email: userEntity.email,
            password: userEntity.password,
        };
        let result = await this.Auth.logIn(validData);
        // id와 비밀번호일치를 확인 > 일치하면 응답, 불일치시 에러응답
        return result;
    }
};
/*
같은 이메일로 로그인 시도 시 카운트 증가 로그인 성공 시 
또는 마지막 접속시도시간으로 부터 일정시간 지난 뒤 카운트 리셋 

로그인 시도 잠금 필요 data
 LOGIN_FAIL_COUNT : 로그인 실패 횟수
 IS_LOCK : 로그인 시도 제한 여부 Y, N으로 저장
 LATEST_TRY_LOGIN_DATE : 최근 접속 시도 시각
 LOCK_COUNT : 로그인 시도 제한 횟수
 */
