module.exports = class GetExamDateList {
    constructor(service) {
        this.service = service;
    }
    async excute(examData) {
        const { adminService } = this.service;
        try {
            const examDateList = await adminService.getExamDateList(examData);
            return examDateList;
        } catch (error) {
            throw error;
        }
    }
};
