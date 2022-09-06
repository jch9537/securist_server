module.exports = class ProfileProjectHistoryRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileProjectHistory(profileProjectHistoryEntity) {
        let result;
        try {
            result = await this.db.getProfileProjectHistory(
                profileProjectHistoryEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
