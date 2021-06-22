const { ProfileEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData, tempData, uploadData) {
        console.log('임시저장 데이터 확인', tempData);
        let result;
        try {
            // userData.userType = 1; // 테스트용
            if (userData.userType !== 1) {
                throw new UserTypeException('사용자 타입');
            }
            let profileEntity = new ProfileEntity(tempData);
            // let createProfileTempEntity = tempData; // 유효성 확인 추가!!!
            profileEntity.email = userData.email;
            profileEntity.userType = userData.userType;

            result = await this.profileRepository.createConsultantProfileTemp(
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
