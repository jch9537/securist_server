module.exports = class GetRegion {
    constructor(service) {
        this.service = service;
    }
    async excute() {
        try {
            const { adminService } = this.service;
            const regionList = await adminService.getRegion();

            return regionList;
        } catch (error) {
            throw error;
        }
    }
};
