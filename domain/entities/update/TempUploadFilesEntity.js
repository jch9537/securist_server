'use strict';

module.exports = class TempUploadFilesEntity {
    constructor({
        tempUploadFileId,
        fileCategoryType,
        fileName,
        filePath,
        consultantProfileTempId,
    }) {
        this.tempUploadFileId = tempUploadFileId;
        this.fileCategoryType = fileCategoryType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
