const { UserEntity } = require('../../entities');

module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(accessToken, updatePasswordData) {
        let result, response;
        try {
            let password;
            password = updatePasswordData.prePassword;
            let prePasswordEntity = new UserEntity({ password });
            password = updatePasswordData.newPassword;
            let newPasswordEntity = new UserEntity({ password });

            let userEntity = {
                accessToken: accessToken,
                prePassword: prePasswordEntity.password,
                newPassword: newPasswordEntity.password,
            };
            response = await this.auth.changePassword(userEntity);

            result = {
                message: '비밀 번호 변경 완료',
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
