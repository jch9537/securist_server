const { getTaskByCertificationSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class GetTasksByCertificationsDto {
    constructor(certificationData) {
        this.certificationData = certificationData;
    }
    get certificationData() {
        return this._certificationData;
    }
    set certificationData(certificationData) {
        const { error, value } = getTaskByCertificationSchema.validate(
            certificationData
        );
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._certificationData = value;
        }
    }
};
