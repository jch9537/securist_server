'use strict';
// 아직 안씀
module.exports = class LinkedClientUsersCompaniesEntity {
    constructor({
        clientUserId,
        clientCompanyId,
        belongingStatus,
        managerType,
        createAt,
        deleteAt,
    }) {
        this.clientUserId = clientUserId;
        this.clientCompanyId = clientCompanyId;
        this.belongingStatus = belongingStatus;
        this.managerType = managerType;
        this.createAt = createAt;
        this.deleteAt = deleteAt;
    }
};
