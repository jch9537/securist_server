'use strict';

module.exports = class TempProfileCareerEntity {
    constructor({
        tempCareerId,
        companyName,
        position,
        assignedWork,
        joiningDate,
        resignationDate,
        consultantProfileTempId,
    }) {
        this.tempCareerId = tempCareerId;
        this.companyName = companyName;
        this.position = position;
        this.assignedWork = assignedWork;
        this.joiningDate = joiningDate;
        this.resignationDate = resignationDate;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
