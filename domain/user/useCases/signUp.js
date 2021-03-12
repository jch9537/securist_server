const crypto = require('crypto');
const UserEntity = require('../entity/userEntity');

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
    //cognito는 비번해시가 필요없나??
    hashPassword(password) {
        let hash = crypto
            .createHmac('sha256', 'secret')
            .update(password)
            .digest('hex');
        console.log(hash);
        return hash;

        // let upgradeBase64crypto = (password) => {
        //     crypto.randomBytes(64, (err, buf) => {
        //         const salt = buf.toString('base64');
        //         return crypto.pbkdf2(
        //             password,
        //             salt,
        //             100,
        //             64,
        //             'sha512',
        //             (err, key) => {
        //                 if (err) throw err;
        //                 // console.log(key.toString('base64'));
        //                 return key.toString('base64');
        //             }
        //         );
        //     });
        // };

        // let result = upgradeBase64crypto(password);
        // return result;
    }
};
