// 어플리케이션 로직 클래스 - 사용자 생성
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    excute({ id, email }) {
        console.log(
            '요청 > Domain > UseCase > createUser.js : excute - req.query.email : ',
            { id, email }
        );

        let result = this.auth.createUser({ id, email });
        return result;
    }
};
