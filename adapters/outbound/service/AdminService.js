// 어드민 서버 요청
module.exports = class AdminService {
    constructor(adminServer) {
        this.adminServer = adminServer;
    }
    // 기본 정보 ======================================
    // 지역 리스트 가져오기
    async getRegion() {
        try {
            const result = await this.adminServer.getRegion();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 선택 지역의 세부 지역 리스트 가져오기
    async getArea(regionData) {
        try {
            const result = await this.adminServer.getArea(regionData);
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 업종 리스트 가져오기
    async getIndustries() {
        try {
            const result = await this.adminServer.getIndustries();
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 설정 ===========================================
    // 인증 ---------------------------
    // 게시 완료된 인증 리스트 조회하기
    async getCompleteCertifications() {
        try {
            const result = await this.adminServer.getCompleteCertifications();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 선택 인증의 모든 연결 정보 가져오기
    async getCertificationConnectedInfo(certificationData) {
        try {
            const result = await this.adminServer.getCertificationConnectedInfo(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 과제 ---------------------------
    // 선택 인증들의 과제 리스트 가져오기
    async getTasksByCertifications(certificationData) {
        try {
            const result = await this.adminServer.getTasksByCertifications(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
