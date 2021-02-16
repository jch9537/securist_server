// 어플리케이션 로직 클래스 - 사용자 생성
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    excute({ email, password }) {
        console.log('Domain > UseCase > createUser.js : this.auth', this.auth);
        return this.auth.createUser({ email, password });
    }
};
