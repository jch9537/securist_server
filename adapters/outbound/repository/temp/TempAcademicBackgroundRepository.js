module.exports = class TempAbilityEtcRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempAcademicBackground(tempAcademicBackgroundEntity) {
        let result;
        try {
            result = await this.db.getTempAcademicBackground(
                tempAcademicBackgroundEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
