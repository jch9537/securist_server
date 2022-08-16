'use strict';

module.exports = class TempProfileAbilityTasksEntity {
    constructor({
        tempAbilityTaskId,
        taskId,
        taskName,
        taskGroupType,
        consultantProfileTempId,
    }) {
        this.tempAbilityTaskId = tempAbilityTaskId;
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskGroupType = taskGroupType;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
