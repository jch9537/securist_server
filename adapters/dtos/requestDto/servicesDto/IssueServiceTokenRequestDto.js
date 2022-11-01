const { createServiceTokenSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class IssueServiceTokenRequestDto {
    constructor(serviceData) {
        this.serviceData = serviceData;
    }
    get serviceData() {
        return this._serviceData;
    }
    set serviceData(serviceData) {
        let { error, value } = createServiceTokenSchema.validate(serviceData);
        // console.log('필터 조건2 ', value);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._serviceData = value;
        }
    }
};
