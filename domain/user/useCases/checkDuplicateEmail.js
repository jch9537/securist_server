//usecase로 사용할지 여부 고민
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute(email) {
        let result = await this.Auth.findUserByEmail(email);
        return result;
    }
};
