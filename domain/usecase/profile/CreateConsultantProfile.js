const { ProfileEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData, profileData, uploadData) {
        console.log('임시저장 데이터 확인', profileData);
        let result, response;
        try {
            // userData.userType = 1; // 테스트용
            if (userData.userType !== 1) {
                throw new UserTypeException('사용자 타입');
            }
            let profileEntity = new ProfileEntity(profileData);

            profileEntity.email = userData.email;
            profileEntity.userType = userData.userType;

            await this.profileRepository.createConsultantProfile(
                profileEntity,
                uploadData
            );

            result = {
                message: '컨설턴트 프로필 등록 완료',
            };
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.error(error);
            error.message = '컨설턴트 프로필 등록 실패';
            throw error;
        }
    }
};
