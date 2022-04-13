// 클라이언트 기업
module.exports = class ClientCompaniesRepository {
    constructor(db) {
        this.db = db;
    }
    async getClientCompany(clientCompaniesEntity) {
        try {
            let result = await this.db.getClientCompany(clientCompaniesEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
