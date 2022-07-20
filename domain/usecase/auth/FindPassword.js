const { AuthEntity } = require('../../entities');
module.exports = class FindPassword {
    constructor(auth) {
        this.auth = auth;
    }
    async excute(findPasswordData) {
        try {
            let authEntity = new AuthEntity(findPasswordData);
            // 가입 여부 확인
            let isExistUser = await this.auth.checkExistUser(authEntity);

            if (!isExistUser) {
                return { message: 'Unregistered users' }; // 가입되지 않은 사용자 응답
            }

            await this.auth.findPassword(authEntity);
            return;

            // if (!response) {
            //     result = {
            //         message: '가입되지 않은 메일입니다.',
            //     };
            // } else {
            //     result = {
            //         message: '비밀 번호 찾기 확인 코드 전송 완료',
            //     };
            // }
        } catch (error) {
            console.error(error);
            // if (!error.authServiceErrorName) {
            //     error.message = '비밀 번호 찾기 코드 전송 실패';
            // }
            // error.message = '비밀 번호 찾기 코드 전송 실패';
            // throw error;
        }
    }
};
