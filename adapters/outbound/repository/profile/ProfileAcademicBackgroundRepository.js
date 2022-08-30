module.exports = class ProfileAbilityEtcRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileAcademicBackground(profileAcademicBackgroundEntity) {
        let result;
        try {
            result = await this.db.getProfileAcademicBackground(
                profileAcademicBackgroundEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
