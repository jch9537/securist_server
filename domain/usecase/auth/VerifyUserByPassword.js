// 사용자 인증 확인 : 비밀번호
const { AuthEntity } = require('../../entities');

module.exports = class VerifyUserByPassword {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(verifyData) {
        try {
            let authEntity = new AuthEntity(verifyData);
            let verifyUserInfo = await this.auth.verifyUserByPassword(
                authEntity
            );

            return verifyUserInfo;
            // result = {
            //     message: '비밀번호 확인 완료',
            //     data: response,
            // };
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '비밀번호 확인 실패';
            // }
            // error.message = '비밀번호 확인 실패';
            throw error;
        }
    }
};
