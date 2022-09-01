const { getConsultantUserSchema } = require('../../../../module/joi');
const { ValidationException } = require('../../../../../domain/exceptions');

module.exports = class GetConsultantUserDto {
    constructor(consultantUserData) {
        this.consultantUserData = consultantUserData;
    }
    get consultantUserData() {
        return this._consultantUserData;
    }
    set consultantUserData(consultantUserData) {
        const { error, value } = getConsultantUserSchema.validate(
            consultantUserData
        );
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._consultantUserData = value;
        }
    }
};
