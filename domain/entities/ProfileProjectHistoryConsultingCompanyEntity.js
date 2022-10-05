'use strict';

module.exports = class ProfileProjectHistoryConsultingCompanyEntity {
    constructor({
        projectHistoryId,
        projectName,
        assignedTask,
        industryCategoryId,
        industryCategoryName,
        projectStartDate,
        projectEndDate,
        consultingCompanyId,
    } = {}) {
        this.projectHistoryId = projectHistoryId;
        this.projectName = projectName;
        this.assignedTask = assignedTask;
        this.industryCategoryId = industryCategoryId;
        this.industryCategoryName = industryCategoryName;
        this.projectStartDate = projectStartDate;
        this.projectEndDate = projectEndDate;
        this.consultingCompanyId = consultingCompanyId;
    }
};
