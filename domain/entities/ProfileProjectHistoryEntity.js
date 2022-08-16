'use strict';

module.exports = class ProfileProjectHistoryEntity {
    constructor({
        projectHistoryId,
        projectName,
        assignedTask,
        industryCategoryId,
        industryCategoryName,
        projectStartDate,
        projectEndDate,
        consultantUserId,
    }) {
        this.projectHistoryId = projectHistoryId;
        this.projectName = projectName;
        this.assignedTask = assignedTask;
        this.industryCategoryId = industryCategoryId;
        this.industryCategoryName = industryCategoryName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.consultantUserId = consultantUserId;
    }
};
