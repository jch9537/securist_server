const { RelationEntity } = require('../../entities');
const { AuthorizationException } = require('../../exceptions');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, updateStatusData) {
        let result;
        try {
            let relationEntity = new RelationEntity(updateStatusData);

            relationEntity.userType = updateStatusData.userType;
            let userType = relationEntity.userType;

            if (userType === 2 || userType === 3) {
                let relationInfo = await this.Repository.getRelationInfo(
                    userData
                );
                let companyBelongingType = relationInfo['belonging_type'];
                let companyManagerType = relationInfo['manager_type'];
                // 기업 관리자 권한 확인
                if (
                    String(companyBelongingType) !== 2 ||
                    String(companyManagerType) !== 1
                ) {
                    throw new AuthorizationException('소속 정보 수정');
                }
            }
            result = await this.Repository.updateBelongingStatus(
                relationEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
