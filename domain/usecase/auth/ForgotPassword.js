const { AuthEntity } = require('../../entities/auth');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let authEntity = new AuthEntity(email);
        let result = await this.Auth.forgotPassword(authEntity.email);
        return result;
    }
};
