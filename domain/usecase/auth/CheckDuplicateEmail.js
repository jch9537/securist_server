const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(checkData) {
        try {
            let userEntity = new UserEntity(checkData);
            let result = await this.Auth.checkDuplicateEmail(userEntity);
            return result;
        } catch (err) {
            throw err;
        }
    }
};
