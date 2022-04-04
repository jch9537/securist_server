const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(resendEmailData) {
        let result, response;
        try {
            let userEntity = new UserEntity(resendEmailData);
            response = await this.auth.resendComfirmEmail(userEntity);

            result = {
                message: '가입 확인 메일 전송 완료',
            };
            return result;
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '가입 확인 메일 전송 실패';
            // }
            error.message = '가입 확인 메일 전송 실패';
            throw error;
        }
    }
};
