// 게시 완료된 인증 리스트 조회하기 : 관리자 서버 요청
module.exports = class GetCompleteCertifications {
    constructor(service) {
        this.service = service;
    }
    async excute() {
        try {
            const { adminService } = this.service;
            // 클라이언트 리스트 가져오기
            const completedCertificationsInfo = await adminService.getCompleteCertifications();

            return completedCertificationsInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
