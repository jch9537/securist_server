// 선택 인증들의 과제 리스트 가져오기 : 관리자 서버 요청
module.exports = class GetTasksByCertifications {
    constructor(service) {
        this.service = service;
    }
    async excute(certificationData) {
        try {
            const { adminService } = this.service;
            // 클라이언트 리스트 가져오기
            const tasksByCertificationsInfo = await adminService.getTasksByCertifications(
                certificationData
            );

            return tasksByCertificationsInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
