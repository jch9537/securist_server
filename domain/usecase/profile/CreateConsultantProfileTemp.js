//Entity 생성해야함!!!
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
            let createProfileTempEntity = tempData; // 유효성 확인 추가!!!
            createProfileTempEntity.email = userData.email;

            result = await this.profileRepository.createConsultantProfileTemp(
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
