// TODO : 2, 4번 처리해야함!!
const { TempProfilesEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class DeleteTempProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData, tempData) {
        let result;
        try {
            let { tempProfilesRepository } = this.repository;
            console.log(' 유스케이스 : ', userData, tempData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 1. 이미 생성되어있는 임시저장 데이터 유무 확인
            // 2. 있다면 업로드 파일 정보들 가져오기
            // 3. 프로필 id로 모든 정보 삭제 (query.js에서 처리)
            // 4. 업로드 파일 정보들이 있다면 S3에서 삭제 (3번 처리후 처리 & commit 처리)

            // ** 확인 사항!! :  외래키 삭제 시 처리되는 삭제도 오류시 transaction되는지 확인

            let tempProfilesEntity = new TempProfilesEntity(userData);
            await tempProfilesRepository.deleteTempProfile(tempProfilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
