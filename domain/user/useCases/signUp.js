const crypto = require('crypto');
const UserEntity = require('../entity/userEntity');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({
        id,
        email,
        password,
        phone_num,
        name,
        user_type,
        user_state,
        login_failure_cnt,
    }) {
        let hashedPassword = hashPassword(password);
        let userEntity = new UserEntity({
            id,
            email,
            password: hashedPassword,
            phone_num,
            name,
            user_type,
            user_state,
            login_failure_cnt,
        });
        let result = await this.Auth.signUp(userEntity);
        return result;
    }

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
