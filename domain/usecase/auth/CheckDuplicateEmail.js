const { AuthEntity } = require('../../entities');
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(authData) {
        try {
            let authEntity = new AuthEntity(authData);
            let existEmail = await this.auth.checkDuplicateEmail(authEntity);

            if (!existEmail.length) {
                return;
                // result = {
                //     message: '사용 가능한 email 입니다.',
                // };
            } else {
                // result = {
                //     message: '이미 가입된 email 입니다.',
                // };
                return { message: 'Already exist' };
            }
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '이메일 중복 확인 실패';
            // }
            error.message = '이메일 중복 확인 실패';
            throw error;
        }
    }
};
