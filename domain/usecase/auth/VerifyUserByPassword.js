// 사용자 인증 확인 : 비밀번호
const { UserEntity } = require('../../entities');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(verifyData) {
        let result;
        try {
            let userEntity = new UserEntity(verifyData);
            console.log('사용자 비번인증---------- : ', userEntity);
            // userEntity.email = email;
            result = await this.Auth.verifyUserByPassword(userEntity);
            // console.log('결과----------------', result);
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
