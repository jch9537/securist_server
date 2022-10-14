module.exports = class GetExamReception {
    constructor(service) {
        this.service = service;
    }
    async excute(receptionData) {
        try {
            const { adminService } = this.service;
            const getExamReception = await adminService.getExamReception(
                receptionData
            );
            return getExamReception;
        } catch (error) {
            throw error;
        }
    }
};
