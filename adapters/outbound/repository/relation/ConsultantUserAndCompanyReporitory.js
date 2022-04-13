// 클라이언트 사용자-기업
module.exports = class ConsultantUserAndCompanyReporitory {
    constructor(db) {
        this.db = db;
    }
    async checkExistConsultantCompanyManager(consultantUserAndCompanyEntity) {
        try {
            let result = await this.db.checkExistConsultantCompanyManager(
                consultantUserAndCompanyEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
