const { repository } = require('../outbound');
const {
    DeleteTempUploadFiles,
} = require('../../domain/usecase/uploadFiles');

module.exports = class TempUploadFilesAdapter {
    constructor() {}

    // 프로필 임시저장 정보 삭제
    async deleteTempUploadFiles(uploadFilesData) {
        try {
            let deleteTempUploadFiles = new DeleteTempUploadFiles(repository);
            let result = await deleteTempUploadFiles.excute(uploadFilesData);

            return result;
        } catch (error) {
            throw error;
        }
    }
};
