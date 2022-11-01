module.exports = class TempCareerRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempCareer(tempCareerEntity) {
        let result;
        try {
            result = await this.db.getTempCareer(tempCareerEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
