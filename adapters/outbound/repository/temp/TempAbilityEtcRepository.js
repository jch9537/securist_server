module.exports = class TempAbilityEtcRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempAbilityEtc(tempAbilityEtcEntity) {
        let result;
        try {
            result = await this.db.getTempAbilityEtc(tempAbilityEtcEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
