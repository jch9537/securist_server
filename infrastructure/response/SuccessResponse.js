module.exports = class {
    constructor(message, data) {
        this.message = message;
        this.data = data;
    }
};

/*
201 '회원 가입 성공 (Created)';
200 : 작성됨, 새로운 리소스 생성 완료 - ex) '로그인 성공 (OK)';
200 '사용자 가져오기 성공 (Success)';    // this.userExist = true;
204 : 성공 & 컨텐츠 제공 X - ex) '로그아웃 완료 (No Content)';
 */
