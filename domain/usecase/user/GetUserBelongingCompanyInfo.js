const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        try {
            let userType = userData.userType;
            if (!(userType === 1 || userType === 2 || userType === 3)) {
                throw new UserTypeException('사용자 타입');
            }
            let result = await this.userRepository.getUserBelongingCompanyInfo(
                userData
            );
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
    }
};
