module.exports = class ProfileEtcCertificationsRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileEtcCertifications(profileEtcCertificationsEntity) {
        let result;
        try {
            result = await this.db.getProfileEtcCertifications(
                profileEtcCertificationsEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
