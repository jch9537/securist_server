module.exports = class UpdateLicenseIssuanceByUser {
    constructor(service) {
        this.service = service;
    }
    async excute(issuanceData) {
        try {
            const { adminService } = this.service;
            const updateLicenseIssuanceByUser = await adminService.updateLicenseIssuanceByUser(
                issuanceData
            );
            return updateLicenseIssuanceByUser;
        } catch (error) {
            throw error;
        }
    }
};
