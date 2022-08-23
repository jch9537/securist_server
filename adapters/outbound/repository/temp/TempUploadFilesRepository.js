module.exports = class TempUploadFilesRepository {
    constructor(db) {
        this.db = db;
    }

    // 프로필 임시저장 업로드 파일들 정보 가져오기
    async getTempUploadFiles(tempUploadFilesEntity) {
        let result;
        try {
            result = await this.db.getTempUploadFiles(tempUploadFilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // // 프로필 임시저장 업로드 파일들 수정 : 수정없이 삭제 후 새로 생성
    // async updateProfileTemp(deleteData) {}

    // 프로필 임시저장 업로드 파일들 정보 삭제
    async deleteTempUploadFiles(tempUploadFilesEntity) {
        let result;
        try {
            result = await this.db.deleteTempUploadFiles(tempUploadFilesEntity);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
