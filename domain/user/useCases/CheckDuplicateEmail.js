module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let result = await this.Auth.checkDuplicateEmail(email);
        return result;
    }
};
