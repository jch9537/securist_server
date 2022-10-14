module.exports = class CreateLicenseIssuance {
    constructor(service) {
        this.service = service;
    }
    async excute(issuanceData) {
        try {
            const { adminService } = this.service;
            const createLicenseIssuance = await adminService.createLicenseIssuance(
                issuanceData
            );
            return createLicenseIssuance;
        } catch (error) {
            throw error;
        }
    }
};
