'use strict';

module.exports = class profileUploadFilesEntity {
    constructor({
        profileUploadFileId,
        fileType,
        fileName,
        filePath,
        profileId,
    }) {
        this.profileUploadFileId = profileUploadFileId;
        this.fileType = fileType;
        this.fileName = fileName;
        this.filePath = filePath;
        this.profileId = profileId;
    }
};
