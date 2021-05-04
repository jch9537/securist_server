const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(checkData) {
        let result;
        try {
            let userEntity = new UserEntity(checkData);

            result = await this.Auth.checkDuplicateEmail(userEntity);
        } catch (err) {
            throw err;
        }
        return result;
    }
};
