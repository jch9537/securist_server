module.exports = class TempEtcCertificationsRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempEtcCertifications(tempEtcCertificationsEntity) {
        let result;
        try {
            result = await this.db.getTempEtcCertifications(
                tempEtcCertificationsEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
