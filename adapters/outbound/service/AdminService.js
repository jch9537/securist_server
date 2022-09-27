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

    // 게시판 =============================================
    // 공지사항 ------------------------
    // 게시된 공지사항 리스트 가져오기
    async getPostingAnnouncementBoards() {
        try {
            const result = await this.adminServer.getPostingAnnouncementBoards();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 개별 공지사항 글 가져오기
    async getAnnouncementBoard(announcementBoardData) {
        try {
            const result = await this.adminServer.getAnnouncementBoard(
                announcementBoardData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 교육 게시판 ------------------------
    // 게시된 교육 게시판 리스트 가져오기
    async getPostingEducationBoards() {
        try {
            const result = await this.adminServer.getPostingEducationBoards();
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 개별 교육 게시판 글 가져오기
    async getEducationBoard(educationBoardData) {
        try {
            const result = await this.adminServer.getEducationBoard(
                educationBoardData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
