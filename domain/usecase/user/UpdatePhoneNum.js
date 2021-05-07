const { UserEntity } = require('../../entities');
const { AuthorizationException } = require('../../exceptions');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, updateData) {
        let updateUserData = {
            email: userData.email,
            userType: userData.userType,
            phoneNum: updateData.phoneNum,
        };
        console.log('업데이트 데이터 : ', updateUserData);
        try {
            let result;
            let userEntity = new UserEntity(updateUserData);

            if (userEntity.userType === 2 || userEntity.userType === 3) {
                let relationInfo = await this.Repository.getRelationInfo(
                    userData
                );
                let companyBelongingType = relationInfo['belonging_type'];
                let companyManagerType = relationInfo['manager_type'];
                console.log(
                    '릴레이션인포------------------------',
                    companyBelongingType,
                    companyManagerType
                );
                // 기업 관리자 권한 확인
                if (companyBelongingType !== 2 || companyManagerType !== 1) {
                    throw new AuthorizationException('기업 정보 수정');
                }
            }
            result = await this.Repository.updatePhoneNum(userEntity);
            console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
