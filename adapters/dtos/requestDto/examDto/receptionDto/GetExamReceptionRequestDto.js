const { getExamReceptionSchema } = require('../../../../module/joi');
const { ValidationException } = require('../../../../../domain/exceptions');

module.exports = class GetExamReceptionRequestDto {
    constructor(receptionData) {
        this.receptionData = receptionData;
    }
    get receptionData() {
        return this._receptionData;
    }
    set receptionData(receptionData) {
        const { error, value } = getExamReceptionSchema.validate(receptionData);
        if (error) {
            const errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._receptionData = value;
        }
    }
};
