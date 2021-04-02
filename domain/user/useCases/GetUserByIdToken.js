module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(token) {
        let result = await this.Auth.getUserByIdToken(token);
        return result;
    }
};
