module.exports = class GetLicenseIssuanceListByReceptionId {
    constructor(service) {
        this.service = service;
    }
    async excute(issuanceData) {
        try {
            const { adminService } = this.service;
            const getLicenseIssuanceListByReceptionId = await adminService.getLicenseIssuanceListByReceptionId(
                issuanceData
            );
            return getLicenseIssuanceListByReceptionId;
        } catch (error) {
            throw error;
        }
    }
};
