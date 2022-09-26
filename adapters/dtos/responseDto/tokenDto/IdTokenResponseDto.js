const { getUserDataByIdTokenSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class IdTokenResponseDto {
    constructor(idTokenData) {
        this.idTokenData = idTokenData;
    }
    get idTokenData() {
        return this._idTokenData;
    }
    set idTokenData(idTokenData) {
        let { error, value } = getUserDataByIdTokenSchema.validate(idTokenData);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._idTokenData = value;
        }
    }
};
