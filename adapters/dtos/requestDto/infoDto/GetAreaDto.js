const { getAreaSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class GetAreaRequestDto {
    constructor(regionData) {
        this.regionData = regionData;
    }
    get regionData() {
        return this._regionData;
    }
    set regionData(regionData) {
        // console.log('아이디', regionData);
        let { error, value } = getAreaSchema.validate(regionData);
        // console.log('아이디 값', value);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._regionData = value;
        }
    }
};
