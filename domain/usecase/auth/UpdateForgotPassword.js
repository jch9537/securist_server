const { AuthEntity } = require('../../entities');
module.exports = class UpdateForgotPassword {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(changePasswordData) {
        let result, response;
        try {
            let authEntity = new AuthEntity(changePasswordData);
            response = await this.auth.updateForgotPassword(authEntity);
            return result;

            // result = {
            //     message: '비밀번호 변경 완료',
            // };
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '비밀번호 변경 실패';
            // }
            // error.message = '비밀번호 변경 실패';
            throw error;
        }
    }
};
