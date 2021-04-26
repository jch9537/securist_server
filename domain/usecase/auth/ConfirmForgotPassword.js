const { ConfirmForgotPasswordEntity } = require('../../entities/auth');
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, password, code }) {
        let confimForgotPasswordEntity = new ConfirmForgotPasswordEntity({
            email,
            password,
            code,
        });
        let result = await this.Auth.confirmForgotPassword(
            confimForgotPasswordEntity
        );
        return result;
    }
};
