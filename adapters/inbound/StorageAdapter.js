const {
    DeleteTempUploadFiles,
    DeleteProfileUploadFiles,
} = require('../../domain/usecase/uploadFiles');
const { repository, storage } = require('../outbound');

module.exports = class StorageAdapter {
    constructor() {}
    // 저장소 업로드 파일 삭제
    async deleteUploadFilesInStorage(storageData) {
        // console.log(
        //     '요청 > adapters > inbound > StorageAdapter > deleteUploadFilesInStorage - parameter : '
        // );
        let result;
        try {
            let { location, deleteUploadFiles } = storageData;
            // 첨부 파일 인지 컨텐츠 파일인지 확인
            if (location) {
                console.log('로케이션', storageData);
                switch (location) {
                    case 'business':
                        // 추가
                        return;
                    // case 'refund':
                    //     return;
                    case 'temp':
                        const deleteTempUploadFiles = new DeleteTempUploadFiles(
                            repository,
                            storage
                        );
                        result = await deleteTempUploadFiles.excute(
                            deleteUploadFiles
                        );
                        return result;
                    case 'profile':
                        const deleteProfileUploadFiles = new DeleteProfileUploadFiles(
                            repository,
                            storage
                        );
                        result = await deleteProfileUploadFiles.excute(
                            deleteUploadFiles
                        );
                        return result;
                }
            } else {
                result = await storage.deleteContentsFilesInStorage(
                    deleteUploadFiles
                );
            }
            // console.log(
            //     '응답 > adapters > inbound > StorageAdapter > deleteUploadFilesInStorage - result : ',
            //     result
            // );
            return result;
        } catch (error) {
            // console.error(
            //     '에러 > adapters > inbound > StorageAdapter > deleteUploadFilesInStorage - error : ',
            //     error
            // );
            throw error;
        }
    }
};
