const { ProfileEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
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
            let profileEntity = new ProfileEntity(tempData);
            // let createProfileTempEntity = tempData; // 유효성 확인 추가!!!
            profileEntity.email = userData.email;
            profileEntity.userType = userData.userType;

            let result = await this.profileRepository.createConsultingCompanyProfile(
                profileEntity,
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
