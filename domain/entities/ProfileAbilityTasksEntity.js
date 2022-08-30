'use strict';

module.exports = class ProfileAbilityTasksEntity {
    constructor({ abilityTaskId, taskId, profileId }) {
        this.abilityTaskId = abilityTaskId;
        this.taskId = taskId;
        // this.taskName = taskName;
        // this.taskGroupType = taskGroupType;
        this.profileId = profileId;
    }
};
