module.exports = class TempAbilityCertificationsRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempAbilityCertifications(tempAbilityCertificationsEntity) {
        let result;
        try {
            result = await this.db.getTempAbilityCertifications(
                tempAbilityCertificationsEntity
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
