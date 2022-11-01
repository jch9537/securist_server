// 컨설턴트 등급 정보
module.exports = class ConsultantPenaltyRepository {
    constructor(db) {
        this.db = db;
    }
    async getCountConsultantPenalty(consultantPenaltyEntity) {
        try {
            let result = await this.db.getCountConsultantPenalty(
                consultantPenaltyEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // async getConsultantGradeInfo(consultantGradeInfoEntity) {
    //     try {
    //         let result = await this.db.getConsultantGradeInfo(
    //             consultantGradeInfoEntity
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // async updateConsultantGradeInfo(consultantGradeInfoEntity) {
    //     try {
    //         let result = await this.db.updateConsultantGradeInfo(
    //             consultantGradeInfoEntity
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
};
