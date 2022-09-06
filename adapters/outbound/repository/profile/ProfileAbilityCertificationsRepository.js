module.exports = class ProfileAbilityCertificationsRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileAbilityCertifications(profileAbilityCertificationsEntity) {
        let result;
        try {
            result = await this.db.getProfileAbilityCertifications(
                profileAbilityCertificationsEntity
            );
            result = result.map(
                (certificationInfo) => certificationInfo.certificationId
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
