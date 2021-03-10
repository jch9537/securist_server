module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let result = await this.Auth.findUserByEmail(email);
        return result;
    }
};
