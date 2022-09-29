'use strict';

module.exports = class LinkedConsultantUsersCompaniesEntity {
    constructor({
        consultantUserId,
        consultingCompanyId,
        belongingStatus,
        managerType,
        createdAt,
        deletedAt,
    }) {
        this.consultantUserId = consultantUserId;
        this.consultingCompanyId = consultingCompanyId;
        this.belongingStatus = belongingStatus;
        this.managerType = managerType;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }
};
