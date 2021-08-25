// 사용자 인증 확인 : 비밀번호
const { UserEntity } = require('../../entities');

module.exports = class {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(verifyData) {
        let result, response;
        try {
            let userEntity = new UserEntity(verifyData);
            response = await this.auth.verifyUserByPassword(userEntity);

            result = {
                message: '비밀번호 확인 완료',
                data: response,
            };
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '비밀번호 확인 실패';
            // }
            error.message = '비밀번호 확인 실패';
            throw error;
        }
        return result;
    }
};
