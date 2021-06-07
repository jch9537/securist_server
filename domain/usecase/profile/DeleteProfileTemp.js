const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData) {
        try {
            if (!(userData.userType === 1 || userData.userType === 2)) {
                throw new UserTypeException('사용자 타입');
            }
            let result = await this.profileRepository.deleteProfileTemp(
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
