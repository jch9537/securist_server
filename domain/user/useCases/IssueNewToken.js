module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(refreshToken) {
        let result = await this.Auth.issueNewToken(refreshToken);
        return result;
    }
};
