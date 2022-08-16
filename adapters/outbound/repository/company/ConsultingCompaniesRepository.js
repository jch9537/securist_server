// 클라이언트 기업
module.exports = class ConsultingCompaniesRepository {
    constructor(db) {
        this.db = db;
    }
    async getConsultingCompany(clientCompaniesEntity) {
        try {
            let result = await this.db.getConsultingCompany(
                clientCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
