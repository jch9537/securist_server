module.exports = class TempAbilityTasksRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempAbilityTasks(tempAbilityTasksEntity) {
        let result;
        try {
            result = await this.db.getTempAbilityTasks(tempAbilityTasksEntity);
            result = result.map((taskInfo) => taskInfo.taskId);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
