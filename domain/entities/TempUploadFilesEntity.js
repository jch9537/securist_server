'use strict';

module.exports = class TempUploadFilesEntity {
    constructor({
        tempUploadFileId,
        fileType,
        fileName,
        filePath,
        tempProfileId,
    }) {
        this.tempUploadFileId = tempUploadFileId;
        this.fileType = fileType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.tempProfileId = tempProfileId;
    }
};
