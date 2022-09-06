const { deleteUploadFilesSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class DeleteUploadFilesDto {
    constructor(uploadFilesData) {
        this.uploadFilesData = uploadFilesData;
    }
    get uploadFilesData() {
        return this._uploadFilesData;
    }
    set uploadFilesData(uploadFilesData) {
        const { error, value } = deleteUploadFilesSchema.validate(
            uploadFilesData
        );
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._uploadFilesData = value;
        }
    }
};
