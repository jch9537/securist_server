const { AuthEntity } = require('../../entities');
module.exports = class ResendSignUpEmail {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(resendEmailData) {
        try {
            let authEntity = new AuthEntity(resendEmailData);
            await this.auth.resendSignUpEmail(authEntity);
            return;

            // result = {
            //     message: '가입 확인 메일 전송 완료',
            // };
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '가입 확인 메일 전송 실패';
            // }
            // error.message = '가입 확인 메일 전송 실패';
            throw error;
        }
    }
};
