const { UserTypeException } = require('../../exceptions');

module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        let result, response;
        try {
            let userType = userData.userType;
            if (!(userType === 2 || userType === 3)) {
                throw new UserTypeException('사용자 타입');
            }
            response = await this.userRepository.getRelationInfo(userData);

            result = {
                message: '사용자-기업 연결 정보 가져오기 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '사용자-기업 연결 정보 가져오기 실패';
            throw error;
        }
    }
};
