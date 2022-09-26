// 사용자 서버
module.exports = class AdminService {
    constructor(adminServer) {
        this.adminServer = adminServer;
    }

    // 인증 ===========================================
    async getCertificaiton() {
        try {
            const result = await this.adminServer.getCertificaiton();
            return result;
        } catch (error) {
            throw error;
        }
    }
};
