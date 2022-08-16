'use strict';

module.exports = class ProfileCareerEntity {
    constructor({
        careerId,
        companyName,
        position,
        assignedWork,
        joiningDate,
        resignationDate,
        consultantUserId,
    }) {
        this.careerId = careerId;
        this.companyName = companyName;
        this.position = position;
        this.assignedWork = assignedWork;
        this.joiningDate = joiningDate;
        this.resignationDate = resignationDate;
        this.consultantUserId = consultantUserId;
    }
};
