module.exports = class ProfileLicenseRepository {
    constructor(db) {
        this.db = db;
    }

    async getProfileLicense(profileLicenseEntity) {
        let result;
        try {
            result = await this.db.getProfileLicense(profileLicenseEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
