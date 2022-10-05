// 컨설턴트 등급 정보
module.exports = class ConsultantGradeInfoRepository {
    constructor(db) {
        this.db = db;
    }
    async getConsultantGradeInfoListByUserIds(consultantUserIds) {
        try {
            let result = await this.db.getConsultantGradeInfoListByUserIds(
                consultantUserIds
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getConsultantGradeInfo(consultantGradeInfoEntity) {
        try {
            let result = await this.db.getConsultantGradeInfo(
                consultantGradeInfoEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateConsultantGradeInfo(consultantGradeInfoEntity) {
        try {
            let result = await this.db.updateConsultantGradeInfo(
                consultantGradeInfoEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
