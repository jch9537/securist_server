const UserEntity = require('../entity/UserEntity');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ email, password, name, userType }) {
        // let hashedPassword = this.hashPassword(password);
        let userEntity = new UserEntity({
            email,
            password,
            name,
            userType,
        });
        let result = await this.Auth.signUp(userEntity);
        return result;
    }
};
