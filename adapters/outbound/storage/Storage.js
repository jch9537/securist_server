// infrastructure 연결 메서드 정의 클래스 : 저장소 (S3)
module.exports = class Storage {
    constructor(storageService) {
        this.storageService = storageService;
    }
    // 첨부 파일 storage 삭제
    async deleteAttachFilesInStorage(deleteAttachFilesData) {
        // console.log(
        //     '요청 > Adapter > outBound > storage > deleteUploadFilesInStorage - parameter : ',
        // );
        try {
            // S3 삭제 파라미터 가공
            let deleteAttachFiles = deleteAttachFilesData.map((fileInfo) => {
                return fileInfo.filePath;
            });
            // // S3 업로드 된 첨부파일 삭제
            // let removeStorageFiles = await this.storage.deleteUploadFilesInStorage(
            //     deleteAttachFiles
            // );

            let result = await this.storageService.deleteUploadFilesInStorage(
                deleteAttachFiles
            );
            // console.log(
            //     '응답 > Adapter > outBound > storage > deleteUploadFilesInStorage > result : ',
            //     result
            // );
            return result;
        } catch (error) {
            // console.error(
            //     '에러 > Adapter > outBound > storage > deleteUploadFilesInStorage > error : ',
            //     error
            // );
            throw error;
        }
    }
    // 에디터 Contents 파일 storage 삭제
    async deleteContentsFilesInStorage(deleteContentsFilesPath) {
        // console.log(
        //     '요청 > Adapter > outBound > storage > deleteUploadFilesInStorage - parameter : ',
        // );
        try {
            // // S3 업로드 된 첨부파일 삭제
            // let removeStorageFiles = await this.storage.deleteUploadFilesInStorage(
            //     deleteAttachFiles
            // );

            let result = await this.storageService.deleteUploadFilesInStorage(
                deleteContentsFilesPath
            );
            // console.log(
            //     '응답 > Adapter > outBound > storage > deleteUploadFilesInStorage > result : ',
            //     result
            // );
            return result;
        } catch (error) {
            // console.error(
            //     '에러 > Adapter > outBound > storage > deleteUploadFilesInStorage > error : ',
            //     error
            // );
            throw error;
        }
    }
};
