module.exports = class TempUploadFilesRepository {
    constructor(db) {
        this.db = db;
    }

    // 개인 컨설턴트 프로필 임시저장 정보 가져오기
    async getConsultantProfileTemp(userData) {
        let result;
        try {
            result = await this.db.getConsultantProfileTemp(userData);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
