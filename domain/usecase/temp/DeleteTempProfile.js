// TODO : 2, 4번 처리해야함!!
const { TempProfilesEntity, TempUploadFilesEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class DeleteTempProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        let result;
        try {
            let { tempProfilesRepository } = this.repository;
            console.log(' 유스케이스 : ', userData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 엔터티 생성
            let tempProfilesEntity = new TempProfilesEntity(userData);
            // 프로필 정보 가져오기
            let tempProfileInfo = await tempProfilesRepository.getTempProfile(
                tempProfilesEntity
            );

            await tempProfilesRepository.deleteTempProfile(tempProfileInfo);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
