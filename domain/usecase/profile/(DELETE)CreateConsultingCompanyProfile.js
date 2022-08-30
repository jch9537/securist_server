const { ProfileEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData, profileData, uploadData) {
        let result, response;
        try {
            if (userData.userType !== 2) {
                throw new UserTypeException('사용자 타입');
            }
            let profileEntity = new ProfileEntity(profileData);
            profileEntity.email = userData.email;
            profileEntity.userType = userData.userType;

            await this.profileRepository.createConsultingCompanyProfile(
                profileEntity,
                uploadData
            );

            result = {
                message: '기업 프로필 등록 완료',
            };
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.error(error);
            error.message = '기업 프로필 등록 실패';
            throw error;
        }
    }
};
