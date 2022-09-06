module.exports = class ProfileCareerRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileCareer(profileCareerEntity) {
        let result;
        try {
            result = await this.db.getProfileCareer(profileCareerEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
