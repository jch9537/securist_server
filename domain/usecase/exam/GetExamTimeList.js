module.exports = class GetExamTimeList {
    constructor(service) {
        this.service = service;
    }
    async excute(examData) {
        const { adminService } = this.service;
        try {
            const examTimeList = await adminService.getExamTimeList(examData);
            return examTimeList;
        } catch (error) {
            throw error;
        }
    }
};
