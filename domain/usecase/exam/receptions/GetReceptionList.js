module.exports = class GetReceptionList {
    constructor(service) {
        this.service = service;
    }
    async excute(receptionData) {
        try {
            const { adminService } = this.service;
            const getReceptionList = await adminService.getReceptionList(
                receptionData
            );
            return getReceptionList;
        } catch (error) {
            throw error;
        }
    }
};
