const { CompanyEntity } = require('../../entities');
const { AuthorizationException } = require('../../exceptions');
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, companyData) {
        let result;
        try {
            let companyEntity = new CompanyEntity(companyData);
            companyEntity.userType = userData.userType;
            let userType = companyEntity.userType;

            if (userType === 2 || userType === 3) {
                let relationInfo = await this.Repository.getRelationInfo(
                    userData
                );
                console.log(
                    '릴레이션인포------------------------',
                    relationInfo
                );
                let companyBelongingType = relationInfo['belonging_type'];
                let companyManagerType = relationInfo['manager_type'];
                // 기업 관리자 권한 확인
                if (companyBelongingType !== 2 || companyManagerType !== 1) {
                    throw new AuthorizationException('소속 정보 수정');
                }
            }

            result = await this.Repository.getCompanyBelongedUsersInfo(
                companyEntity
            );
            console.log('클라이언트 기업 결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
