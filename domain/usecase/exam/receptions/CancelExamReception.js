module.exports = class CancelExamReception {
    constructor(service) {
        this.service = service;
    }
    async excute(receptionData) {
        try {
            const { adminService } = this.service;
            const cancelExamReception = await adminService.cancelExamReception(
                receptionData
            );
            return cancelExamReception;
        } catch (error) {
            throw error;
        }
    }
};
