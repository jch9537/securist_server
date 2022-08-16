'use strict';
// 아직 안씀
module.exports = class ClientUserAndCompanyEntity {
    constructor({
        clientUserId,
        clientCompanyId,
        belongingStatus,
        managerType,
    }) {
        this.clientUserId = clientUserId;
        this.clientCompanyId = clientCompanyId;
        this.belongingStatus = belongingStatus;
        this.managerType = managerType;
    }
};
