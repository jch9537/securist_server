module.exports = class TempAbilityIndustriesRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempAbilityIndustries(tempAbilityIndustriesEntity) {
        let result;
        try {
            result = await this.db.getTempAbilityIndustries(
                tempAbilityIndustriesEntity
            );
            result = result.map((industryInfo) => industryInfo.industryId);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
