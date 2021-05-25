const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(resendEmailData) {
        try {
            let userEntity = new UserEntity(resendEmailData);
            let result = await this.Auth.resendComfirmEmail(userEntity);
            return result;
        } catch (err) {
            throw err;
        }
    }
};
