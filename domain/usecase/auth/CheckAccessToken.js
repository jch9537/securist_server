module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(accessToken) {
        try {
            let result = await this.Auth.checkAccessToken(accessToken);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
