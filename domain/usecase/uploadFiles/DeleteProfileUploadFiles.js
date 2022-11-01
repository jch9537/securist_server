const { TempUploadFilesEntity } = require('../../entities');
// const { UserTypeException } = require('../../exceptions');
module.exports = class DeleteProfileUploadFiles {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(uploadFilesData) {
        let result;
        try {
            let { profileUploadFilesRepository } = this.repository;
            console.log(' 유스케이스 : ', uploadFilesData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            await profileUploadFilesRepository.deleteProfileUploadFiles(
                uploadFilesData
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
// 첨부 파일 개별 삭제
module.exports = class DeleteProfileUploadFiles {
    constructor(repository, storage) {
        this.repository = repository;
        this.storage = storage;
    }
    async excute(deleteUploadFileIds) {
        const { profileUploadFilesRepository } = this.repository;
        try {
            // 게시글, 첨부파일 DB 삭제 : 업로드 파일 id들 배열
            await profileUploadFilesRepository.deleteProfileUploadFiles(
                deleteUploadFileIds
            );

            return;
        } catch (error) {
            console.error(error);

            throw error;
        }
    }
};
