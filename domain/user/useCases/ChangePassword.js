module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ token, prePassword, newPassword }) {
        let result = await this.Auth.changePassword({
            token,
            prePassword,
            newPassword,
        });
        return result;
    }
};
