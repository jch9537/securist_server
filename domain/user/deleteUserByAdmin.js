// 어플리케이션 로직 클래스 - 사용자 생성
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    excute({ id }) {
        console.log(
            '요청 > Domain > UseCase > deleteUserByAdmin.js : excute - req.body : ',
            id
        );

        let result = this.auth.deleteUserByAdmin(id);
        return result;
    }
};
