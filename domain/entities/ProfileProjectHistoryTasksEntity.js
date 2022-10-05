'use strict';

module.exports = class ProfileProjectHistoryTasksEntity {
    constructor({
        projectHistoryTaskId,
        taskType,
        taskTypeName,
        projectHistoryId,
    } = {}) {
        this.projectHistoryTaskId = projectHistoryTaskId;
        this.taskType = taskType;
        this.taskTypeName = taskTypeName;
        this.projectHistoryId = projectHistoryId;
    }
};
