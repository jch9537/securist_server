const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(checkData) {
        let result, response;
        try {
            let userEntity = new UserEntity(checkData);
            response = await this.auth.checkDuplicateEmail(userEntity);

            if (!response.length) {
                result = {
                    message: '사용 가능한 email 입니다.',
                };
            } else {
                result = {
                    message: '이미 가입된 email 입니다.',
                };
            }
            return result;
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
