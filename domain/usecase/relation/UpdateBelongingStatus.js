const { RelationEntity } = require('../../entities');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(updateStatusData) {
        try {
            let relationEntity = new RelationEntity(updateStatusData);

            relationEntity.userType = updateStatusData.userType;
            // let updateRelationEntity = new UpdateBelongingStatusEntity(
            //     updateData
            // );
            // updateRelationEntity.companyId = updateData.companyId;

            let result = await this.Repository.updateBelongingStatus(
                relationEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
