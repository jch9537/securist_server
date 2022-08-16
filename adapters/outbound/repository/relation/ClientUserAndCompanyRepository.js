// 클라이언트 사용자-기업
module.exports = class ClientUserAndCompanyRepository {
    constructor(db) {
        this.db = db;
    }
    async checkExistClientCompanyManager(clientCompaniesEntity) {
        try {
            let result = await this.db.checkExistClientCompanyManager(
                clientCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
