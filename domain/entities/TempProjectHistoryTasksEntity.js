'use strict';

module.exports = class TempProjectHistoryTasksEntity {
    constructor({
        tempProjectHistoryTaskId,
        taskType,
        taskTypeName,
        tempProjectHistoryId,
    } = {}) {
        this.tempProjectHistoryTaskId = tempProjectHistoryTaskId;
        this.taskType = taskType;
        this.taskTypeName = taskTypeName;
        this.tempProjectHistoryId = tempProjectHistoryId;
    }
};
