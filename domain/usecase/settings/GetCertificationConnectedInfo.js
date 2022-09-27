// 선택 인증의 모든 연결 정보 가져오기 : 관리자 서버 요청
module.exports = class GetCertificationConnectedInfo {
    constructor(service) {
        this.service = service;
    }
    async excute(certificationData) {
        try {
            const { adminService } = this.service;
            // 클라이언트 리스트 가져오기
            const certificationConnetedInfo = await adminService.getCertificationConnectedInfo(
                certificationData
            );

            return certificationConnetedInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
