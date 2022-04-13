'use strict';

module.exports = class ConsultantUserAndCompanyEntity {
    constructor({
        consultantUserId,
        consultingCompanyId,
        belongingStatus,
        managerType,
    }) {
        this.consultantUserId = consultantUserId;
        this.consultingCompanyId = consultingCompanyId;
        this.belongingStatus = belongingStatus;
        this.managerType = managerType;
    }
};
