'use strict';

module.exports = class ProfileAbilityTasksEntity {
    constructor({
        abilityTaskId,
        taskId,
        taskName,
        taskGroupType,
        consultantUserId,
    }) {
        this.abilityTaskId = abilityTaskId;
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskGroupType = taskGroupType;
        this.consultantUserId = consultantUserId;
    }
};
