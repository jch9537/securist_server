module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, code, password }) {
        let result = await this.Auth.confirmForgotPassword({
            email,
            code,
            password,
        });
        return result;
    }
};
