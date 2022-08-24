const { TempUploadFilesEntity } = require('../../../entities');
// const { UserTypeException } = require('../../exceptions');
module.exports = class DeleteTempUploadFiles {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(uploadFilesData) {
        let result;
        try {
            let { tempUploadFilesRepository } = this.repository;
            console.log(' 유스케이스 : ', uploadFilesData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            await tempUploadFilesRepository.deleteTempUploadFiles(
                uploadFilesData
            );

            return result;
        } catch (error) {
            throw error;
        }
    }
};
