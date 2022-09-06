module.exports = class ProfileAbilityTasksRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileAbilityTasks(profileAbilityTasksEntity) {
        let result;
        try {
            result = await this.db.getProfileAbilityTasks(
                profileAbilityTasksEntity
            );
            result = result.map((taskInfo) => taskInfo.taskId);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
