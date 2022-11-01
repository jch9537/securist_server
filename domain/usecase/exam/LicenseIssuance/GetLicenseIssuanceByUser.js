module.exports = class GetLicenseIssuanceByUser {
    constructor(service) {
        this.service = service;
    }
    async excute(issuanceData) {
        try {
            const { adminService } = this.service;
            const getLicenseIssuanceByUser = await adminService.getLicenseIssuanceByUser(
                issuanceData
            );
            return getLicenseIssuanceByUser;
        } catch (error) {
            throw error;
        }
    }
};
