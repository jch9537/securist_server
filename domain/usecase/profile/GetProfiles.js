const { ProfilesEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class GetProfiles {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        try {
            let { profilesRepository } = this.repository;
            console.log(' 유스케이스 : ', userData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 엔터티 생성
            let profilesEntity = new ProfilesEntity(userData);
            // 최신 프로필 정보 가져오기
            const consultantProfilesInfo = await profilesRepository.getProfiles(
                profilesEntity
            );
            console.log('최신 프로필 정보 : ', consultantProfilesInfo);

            return consultantProfilesInfo;
        } catch (error) {
            throw error;
        }
    }
};
