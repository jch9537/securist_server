module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(token) {
        let result = await this.Auth.checkAccessToken(token);
        return result;
    }
};