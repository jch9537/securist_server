module.exports = class GetIndustries {
    constructor(service) {
        this.service = service;
    }
    async excute() {
        try {
            const { adminService } = this.service;
            const industriesInfo = await adminService.getIndustries();

            return industriesInfo;
        } catch (error) {
            throw error;
        }
    }
};
