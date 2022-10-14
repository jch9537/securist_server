module.exports = class CreateExamReception {
    constructor(service) {
        this.service = service;
    }
    async excute(receptionData) {
        try {
            const { adminService } = this.service;
            const createExamReception = await adminService.createExamReception(
                receptionData
            );
            return createExamReception;
        } catch (error) {
            throw error;
        }
    }
};
