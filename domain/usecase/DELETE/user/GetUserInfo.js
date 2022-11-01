const { NoContent } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        let result, response;
        try {
            let { userType } = userData;
            response = await this.userRepository.getUserInfo(userData);

            if (userType === 3) {
            } else {
                userType == 2;
            }

            if (response === undefined) {
                throw new NoContent('사용자 정보');
            }

            result = {
                message: '사용자 정보 가져오기 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '사용자 정보 가져오기 실패';
            throw error;
        }
    }
};
