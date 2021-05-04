const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(changePasswordData) {
        try {
            let userEntity = new UserEntity(changePasswordData);
            let result = await this.Auth.confirmForgotPassword(userEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
