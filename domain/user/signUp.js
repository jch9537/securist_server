// 어플리케이션 로직 클래스 - 사용자 생성
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    excute({ id, email, password }) {
        console.log(
            '요청 > Domain > UseCase > signup.js : excute - req.query.email : ',
            { id, email, password }
        );

        let result = this.auth.createUser({ id, email, password });
        return result;
    }
};
