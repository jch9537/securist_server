const { UserEntity } = require('../entity');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let userEntity = new UserEntity(email);
        let result = await this.Auth.forgotPassword(userEntity.email);
        return result;
    }
};
