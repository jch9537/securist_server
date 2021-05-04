module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(refreshToken) {
        try {
            let result = await this.Auth.issueNewToken(refreshToken);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
