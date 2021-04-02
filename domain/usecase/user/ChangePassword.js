const { ChangePasswordEntity } = require('../../entities/user');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ token, prePassword, newPassword }) {
        let prePasswordEntity = new ChangePasswordEntity(prePassword);
        let newPasswordEntity = new ChangePasswordEntity(newPassword);
        let changePasswordEntity = {
            token: token,
            prePassword: prePasswordEntity.password,
            newPassword: newPasswordEntity.password,
        };
        let result = await this.Auth.changePassword(changePasswordEntity);
        return result;
    }
};
