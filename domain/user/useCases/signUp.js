const crypto = require('crypto');
const UserEntity = require('../entity/userEntity');

module.exports = class {
    constructor(Auth) {
        this.Auth = Auth;
    }
    async excute({
        email,
        password,
        name,
        userType,
        // user_state,
        // login_failure_cnt,
        // business_license_num,
        // client_name,
        // president_name,
    }) {
        // let hashedPassword = this.hashPassword(password);
        let userEntity = new UserEntity({
            email,
            password,
            name,
            userType,
            // user_state,
            // login_failure_cnt,
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

/*
같은 이메일로 로그인 시도 시 카운트 증가 로그인 성공 시 
또는 마지막 접속시도시간으로 부터 일정시간 지난 뒤 카운트 리셋 

로그인 시도 잠금 필요 data
 LOGIN_FAIL_COUNT : 로그인 실패 횟수
 IS_LOCK : 로그인 시도 제한 여부 Y, N으로 저장
 LATEST_TRY_LOGIN_DATE : 최근 접속 시도 시각
 LOCK_COUNT : 로그인 시도 제한 횟수
 */
