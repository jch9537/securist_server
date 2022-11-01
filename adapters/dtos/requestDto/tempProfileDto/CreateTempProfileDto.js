const { createTempProfileSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class CreateTempProfileDto {
    constructor(tempData) {
        this.tempData = tempData;
    }
    get tempData() {
        return this._tempData;
    }
    set tempData(tempData) {
        const { error, value } = createTempProfileSchema.validate(tempData);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._tempData = value;
        }
    }
};
