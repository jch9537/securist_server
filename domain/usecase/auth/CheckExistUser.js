const { AuthEntity } = require('../../entities');
module.exports = class CheckExistUser {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(authData) {
        try {
            let authEntity = new AuthEntity(authData);
            await this.auth.checkExistUser(authEntity);
            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
