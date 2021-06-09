const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData) {
        let result;
        try {
            let userType = userData.userType;
            if (!(userType === 1 || userType === 2)) {
                throw new UserTypeException('사용자 타입');
            }
            result = await this.profileRepository.checkProfileTempExist(
                userData
            );
            console.log('결과----------------', result);

            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
