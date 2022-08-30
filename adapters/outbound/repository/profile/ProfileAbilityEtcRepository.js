module.exports = class ProfileAbilityEtcRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileAbilityEtc(profileAbilityEtcEntity) {
        let result;
        try {
            result = await this.db.getProfileAbilityEtc(
                profileAbilityEtcEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
