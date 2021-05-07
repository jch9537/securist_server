const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(forgotPasswordData) {
        try {
            let userEntity = new UserEntity(forgotPasswordData);
            let result = await this.Auth.forgotPassword(userEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
