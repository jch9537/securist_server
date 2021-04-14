const { AuthEntity } = require('../../entities/auth');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let authEntity;
        try {
            authEntity = new AuthEntity(email);
        } catch (err) {
            throw err;
        }
        let result = await this.Auth.checkDuplicateEmail(userEntity.email);
        return result;
    }
};
