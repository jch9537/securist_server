'use strict';

module.exports = class TempAbilityTasksEntity {
    constructor({ tempAbilityTaskId, taskId, tempProfileId }) {
        this.tempAbilityTaskId = tempAbilityTaskId;
        this.taskId = taskId;
        this.tempProfileId = tempProfileId;
    }
};
