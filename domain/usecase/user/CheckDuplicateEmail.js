const { UserEntity } = require('../../entities/user');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let userEntity;
        try {
            userEntity = new UserEntity(email);
        } catch (err) {
            throw err;
        }
        let result = await this.Auth.checkDuplicateEmail(userEntity.email);
        return result;
    }
};
