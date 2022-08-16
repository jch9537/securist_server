const { AuthEntity } = require('../../entities');

module.exports = class ChangePassword {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(updatePasswordData, accessToken) {
        try {
            let authEntity = updatePasswordData;
            await this.auth.changePassword(authEntity, accessToken);
            return;

            // result = {
            //     message: '비밀 번호 변경 완료',
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
