const { ProfileEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository, profileRepository }) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }
    async excute(userData, tempData, uploadData) {
        let result, response;
        try {
            if (userData.userType !== 2) {
                throw new UserTypeException('사용자 타입');
            }
            let profileEntity = new ProfileEntity(tempData);
            profileEntity.email = userData.email;
            profileEntity.userType = userData.userType;

            await this.profileRepository.createConsultingCompanyProfileTemp(
                profileEntity,
                uploadData
            );

            result = {
                message: '기업 프로필 임시 저장 완료',
            };
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.error(error);
            error.message = '기업 프로필 임시 저장 실패';
            throw error;
        }
    }
};
