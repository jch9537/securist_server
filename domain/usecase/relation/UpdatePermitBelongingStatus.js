const {
    UpdatePermitBelongingStatusEntity,
} = require('../../entities/relation');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(updateData) {
        let result;
        try {
            // selectUserId(email) 만 확인, 나머지는 복호화한 데이터므로 안전한 데이터임을 보장함
            let updateRelationEntity = new UpdatePermitBelongingStatusEntity(
                updateData
            );
            updateRelationEntity.userType = updateData.userType;
            updateRelationEntity.companyId = updateData.companyId;

            result = await this.Repository.updatePermitBelongingStatus(
                updateRelationEntity
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
};
