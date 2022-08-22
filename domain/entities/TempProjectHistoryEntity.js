'use strict';

module.exports = class TempProjectHistoryEntity {
    constructor({
        tempProjectHistoryId,
        projectName,
        assignedTask,
        industryCategoryId,
        industryCategoryName,
        projectStartDate,
        projectEndDate,
        tempProfileId,
    }) {
        this.tempProjectHistoryId = tempProjectHistoryId;
        this.projectName = projectName;
        this.assignedTask = assignedTask;
        this.industryCategoryId = industryCategoryId;
        this.industryCategoryName = industryCategoryName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.tempProfileId = tempProfileId;
    }
};
