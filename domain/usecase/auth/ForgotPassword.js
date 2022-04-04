const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(forgotPasswordData) {
        let result, response;
        try {
            let userEntity = new UserEntity(forgotPasswordData);
            response = await this.auth.forgotPassword(userEntity);

            if (!response) {
                result = {
                    message: '가입되지 않은 메일입니다.',
                };
            } else {
                result = {
                    message: '비밀 번호 찾기 확인 코드 전송 완료',
                };
            }
            return result;
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '비밀 번호 찾기 코드 전송 실패';
            // }
            error.message = '비밀 번호 찾기 코드 전송 실패';
            throw error;
        }
    }
};
