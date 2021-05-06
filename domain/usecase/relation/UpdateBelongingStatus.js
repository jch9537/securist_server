const { UpdateBelongingStatusEntity } = require('../../entities/relation');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(updateData) {
        let result;
        try {
            // selectUserId(email), 업데이트 할 상태(status) 만 확인, 나머지는 복호화한 데이터므로 안전한 데이터임을 보장함
            let updateRelationEntity = new UpdateBelongingStatusEntity(
                updateData
            );
            updateRelationEntity.userType = updateData.userType;
            updateRelationEntity.companyId = updateData.companyId;

            result = await this.Repository.updateBelongingStatus(
                updateRelationEntity
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
};
