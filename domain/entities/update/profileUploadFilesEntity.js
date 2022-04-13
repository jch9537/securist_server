'use strict';

module.exports = class profileUploadFilesEntity {
    constructor({
        profileUploadFileId,
        fileCategoryType,
        fileName,
        filePath,
        consultantUserId,
    }) {
        this.profileUploadFileId = profileUploadFileId;
        this.fileCategoryType = fileCategoryType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.consultantUserId = consultantUserId;
    }
};
