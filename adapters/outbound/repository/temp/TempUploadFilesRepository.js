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

    // // 프로필 임시저장 정보 수정 : 수정없이 삭제 후 새로 생성
    // async updateProfileTemp(deleteData) {}

    // 프로필 임시저장 정보 삭제 : 컨설턴트 (개인/기업) 공통
    async deleteProfileTemp(userData) {
        let result;
        try {
            result = await this.db.deleteProfileTemp(userData);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
