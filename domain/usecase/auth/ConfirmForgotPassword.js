const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(changePasswordData) {
        let result, response;
        try {
            let userEntity = new UserEntity(changePasswordData);
            response = await this.auth.confirmForgotPassword(userEntity);

            result = {
                message: '비밀번호 변경 완료',
            };
            return result;
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '비밀번호 변경 실패';
            // }
            error.message = '비밀번호 변경 실패';
            throw error;
        }
    }
};
