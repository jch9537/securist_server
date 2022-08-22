'use strict';

module.exports = class ProfileProjectHistoryEntity {
    constructor({
        tempProjectHistoryId,
        projectName,
        assignedTask,
        industryCategoryId,
        industryCategoryName,
        projectStartDate,
        projectEndDate,
        consultantProfileTempId,
    }) {
        this.tempProjectHistoryId = tempProjectHistoryId;
        this.projectName = projectName;
        this.assignedTask = assignedTask;
        this.industryCategoryId = industryCategoryId;
        this.industryCategoryName = industryCategoryName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
