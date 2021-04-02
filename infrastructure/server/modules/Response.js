module.exports = class {
    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
};

/*
201 '회원 가입 성공 (Created)';
200 '로그인 성공 (OK)';
200 '사용자 가져오기 성공 (Success)';    // this.userExist = true;
204 '로그아웃 완료 (No Content)';
 */
