module.exports = class ProfileUploadFilesRepository {
    constructor(db) {
        this.db = db;
    }

    // 프로필 업로드 파일들 정보 가져오기
    async getProfileUploadFiles(profileUploadFilesEntity) {
        let result;
        try {
            result = await this.db.getProfileUploadFiles(
                profileUploadFilesEntity
            );

            return result;
        } catch (error) {
            throw error;
        }
    }

    // // 프로필 업로드 파일들 수정 : 수정없이 삭제 후 새로 생성
    // async updateProfileProfile(deleteData) {}

    // 프로필 업로드 파일들 정보 삭제
    async deleteProfileUploadFiles(profileUploadFilesEntities) {
        let result;
        try {
            result = await this.db.deleteProfileUploadFiles(
                profileUploadFilesEntities
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
