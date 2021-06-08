const { UserTypeException } = require('../../exceptions');

module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        try {
            let userType = userData.userType;
            console.log('1111111111111111111111111111111', userType);
            if (!(userType === 2 || userType === 3)) {
                throw new UserTypeException('사용자 타입');
            }
            let result = await this.userRepository.getRelationInfo(userData);
            console.log('relation info결과----------------', result);
            return result;
        } catch (error) {
            console.log('relation info 에러 ----------------', error);
            throw error;
        }
    }
};
