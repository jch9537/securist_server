module.exports = class TempProjectHistoryRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempProjectHistory(tempProjectHistoryEntity) {
        let result;
        try {
            result = await this.db.getTempProjectHistory(
                tempProjectHistoryEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
