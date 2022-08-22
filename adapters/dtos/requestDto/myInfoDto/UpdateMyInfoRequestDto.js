const { updateMyInfoSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class UpdateMyInfoRequestDto {
    constructor(myData) {
        this.myData = myData;
    }
    get myData() {
        return this._myData;
    }
    set myData(myData) {
        let { error, value } = updateMyInfoSchema.validate(myData);
        // console.log('필터 조건2 ', value);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._myData = value;
        }
    }
};
