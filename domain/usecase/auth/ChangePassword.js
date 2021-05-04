const { UserEntity } = require('../../entities');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(accessToken, updatePasswordData) {
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
        let result = await this.Auth.changePassword(userEntity);
        return result;
    }
};
