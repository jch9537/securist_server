// 클라이언트 기업
module.exports = class ClientGradeInfoRepository {
    constructor(db) {
        this.db = db;
    }
    async getClientGradeInfoListByUserIds(clientUserIds) {
        try {
            let result = await this.db.getClientGradeInfoListByUserIds(
                clientUserIds
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getClientGradeInfo(clientGradeInfoEntity) {
        try {
            let result = await this.db.getClientGradeInfo(
                clientGradeInfoEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateClientGradeInfo(clientGradeInfoEntity) {
        try {
            let result = await this.db.updateClientGradeInfo(
                clientGradeInfoEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
