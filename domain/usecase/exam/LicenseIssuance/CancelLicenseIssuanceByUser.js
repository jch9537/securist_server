module.exports = class CancelLicenseIssuanceByUser {
    constructor(service) {
        this.service = service;
    }
    async excute(issuanceData) {
        try {
            const { adminService } = this.service;
            const cancelLicenseIssuanceByUser = await adminService.cancelLicenseIssuanceByUser(
                issuanceData
            );
            return cancelLicenseIssuanceByUser;
        } catch (error) {
            throw error;
        }
    }
};
