const { SignUpEntity } = require('../entity');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, password, name, userType }) {
        let signUpEntity = new SignUpEntity({
            email,
            password,
            name,
            userType,
        });
        let result = await this.Auth.signUp(signUpEntity);
        return result;
    }
};
