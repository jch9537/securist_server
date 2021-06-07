const { UserTypeException } = require('../../exceptions');
//Entity 생성해야함!!!
module.exports = class {
    constructor({ userRepository, profileRepository }) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }
    async excute(userData, tempData, uploadData) {
        try {
            if (userData.userType !== 2) {
                throw new UserTypeException('사용자 타입');
            }
            let createProfileTempEntity = tempData; // 유효성 확인 추가!!!
            createProfileTempEntity.email = userData.email;
            createProfileTempEntity.userType = userData.userType;

            let result = await this.profileRepository.createConsultingCompanyProfileTemp(
                createProfileTempEntity,
                uploadData
            );
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
    }
};
