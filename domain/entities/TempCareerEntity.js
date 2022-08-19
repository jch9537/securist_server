'use strict';

module.exports = class TempCareerEntity {
    constructor({
        tempCareerId,
        companyName,
        position,
        assignedWork,
        joiningDate,
        resignationDate,
        tempProfileId,
    }) {
        this.tempCareerId = tempCareerId;
        this.companyName = companyName;
        this.position = position;
        this.assignedWork = assignedWork;
        this.joiningDate = joiningDate;
        this.resignationDate = resignationDate;
        this.tempProfileId = tempProfileId;
    }
};
