// 사용자 인증 확인 : 비밀번호
const { VerifyUserByPasswordEntity } = require('../../entities/auth');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, password }) {
        let result;
        try {
            let verifyUserByPasswordEntity = new VerifyUserByPasswordEntity(
                password
            );
            console.log(
                '사용자 비번인증---------- : ',
                verifyUserByPasswordEntity
            );
            verifyUserByPasswordEntity.email = email;
            result = await this.Auth.verifyUserByPassword(
                verifyUserByPasswordEntity
            );
            console.log('결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
