// 로그아웃
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(token) {
        let result = await this.Auth.logOut(token);
        return result;
    }
};
