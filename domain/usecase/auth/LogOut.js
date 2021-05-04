// 로그아웃
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(AccessToken) {
        try {
            let result = await this.Auth.logOut(AccessToken);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
