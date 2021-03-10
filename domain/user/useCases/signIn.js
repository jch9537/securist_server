const crypto = require('crypto');
const UserEntity = require('../entity/userEntity');
//로그인
module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({ id, password }) {
        let hashedPassword = hashPassword(password);
        let userEntity = new UserEntity({
            id,
            password: hashedPassword,
        });
        let result = await this.Auth.signup(userEntity);
        // id와 비밀번호일치를 확인 > 일치하면 응답, 불일치시 에러응답
        return result;
    }

    hashPassword(password) {
        // let upgradeBase64crypto = (password) => {
        //     crypto.randomBytes(64, (err, buf) => {
        //         const salt = buf.toString('base64');
        //         crypto.pbkdf2(password, salt, 100, 64, 'sha512', (err, key) => {
        //             console.log(key.toString('base64'));
        //         });
        //     });
        // };
        // let result = await upgradeBase64crypto(password);
        let secret = process.env.SECRET_KEY;
        let hash = crypto
            .createHmac('sha256', 'secret')
            .update(password)
            .digest('hex');
        console.log(hash);
        return hash;
    }
};
