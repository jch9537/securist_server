module.exports = class ProfileAbilityIndustriesRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileAbilityIndustries(profileAbilityIndustriesEntity) {
        let result;
        try {
            result = await this.db.getProfileAbilityIndustries(
                profileAbilityIndustriesEntity
            );
            result = result.map((industryInfo) => industryInfo.industryId);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
