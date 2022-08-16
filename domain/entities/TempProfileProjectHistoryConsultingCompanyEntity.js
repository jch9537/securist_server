'use strict';

module.exports = class TempProfileProjectHistoryConsultingCompanyEntity {
    constructor({
        tempProjectHistoryId,
        projectName,
        assignedTask,
        industryCategoryId,
        industryCategoryName,
        projectStartDate,
        projectEndDate,
        consultingCompanyProfileTempId,
    }) {
        this.tempProjectHistoryId = tempProjectHistoryId;
        this.projectName = projectName;
        this.assignedTask = assignedTask;
        this.industryCategoryId = industryCategoryId;
        this.industryCategoryName = industryCategoryName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.consultingCompanyProfileTempId = consultingCompanyProfileTempId;
    }
};
