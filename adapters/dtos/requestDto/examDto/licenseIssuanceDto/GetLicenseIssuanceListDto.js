const { getLicenseIssuanceListSchema } = require('../../../../module/joi');
const { ValidationException } = require('../../../../../domain/exceptions');

module.exports = class GetLicenseIssuanceListDto {
    constructor(issuanceData) {
        this.issuanceData = issuanceData;
    }
    get issuanceData() {
        return this._issuanceData;
    }
    set issuanceData(issuanceData) {
        const { error, value } = getLicenseIssuanceListSchema.validate(
            issuanceData
        );
        if (error) {
            const errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._issuanceData = value;
        }
    }
};
