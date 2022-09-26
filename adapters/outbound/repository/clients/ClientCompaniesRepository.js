// 클라이언트 기업
module.exports = class ClientCompaniesRepository {
    constructor(db) {
        this.db = db;
    }
    async getClientCompanies() {
        try {
            let result = await this.db.getClientCompanies();
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getClientCompany(clientCompaniesEntity) {
        try {
            let result = await this.db.getClientCompany(clientCompaniesEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateClientCompany(clientCompaniesEntity) {
        try {
            let result = await this.db.updateClientCompany(
                clientCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
