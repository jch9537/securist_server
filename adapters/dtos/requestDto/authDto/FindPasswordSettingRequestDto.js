const { findPasswordSettingSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class FindPasswordSettingRequestDto {
    constructor(authData) {
        this.authData = authData;
    }
    get authData() {
        return this._authData;
    }
    set authData(authData) {
        let { error, value } = findPasswordSettingSchema.validate(authData);
        // console.log('필터 조건2 ', value);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._authData = value;
        }
    }
};
