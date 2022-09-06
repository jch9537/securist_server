'use strict';

module.exports = class TempProjectHistoryEntity {
    constructor({
        tempProjectHistoryId,
        certificationId,
        certificationName,
        industryId,
        industryName,
        companyName,
        taskType,
        taskTypeName,
        projectStartDate,
        projectEndDate,
        tempProfileId,
    }) {
        this.tempProjectHistoryId = tempProjectHistoryId;
        this.certificationId = certificationId;
        this.certificationName = certificationName;
        this.industryId = industryId;
        this.industryName = industryName;
        this.companyName = companyName;
        this.taskType = taskType;
        this.taskTypeName = taskTypeName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.tempProfileId = tempProfileId;
    }
};
