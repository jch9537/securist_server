module.exports = class TempLicenseRepository {
    constructor(db) {
        this.db = db;
    }

    async getTempLicense(tempLicenseEntity) {
        let result;
        try {
            result = await this.db.getTempLicense(tempLicenseEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
