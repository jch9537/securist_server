module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let result = await this.Auth.forgotPassword(email);
        return result;
    }
};
