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

            if (userType === 1) {
                result = await this.profileRepository.getConsultantProfile(
                    userData
                );
                console.log('결과----------------', result);
            } else {
                // userData.userType === 2
                result = await this.profileRepository.getConsultingCompanyProfile(
                    userData
                );
                console.log('결과----------------', result);
            }
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
