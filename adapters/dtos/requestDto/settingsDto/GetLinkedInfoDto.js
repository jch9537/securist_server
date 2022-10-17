const { getLinkedInfoSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');
module.exports = class GetLinkedInfoDto {
    constructor(linkData) {
        this.linkData = linkData;
    }
    get linkData() {
        return this._linkData;
    }
    set linkData(linkData) {
        let { error, value } = getLinkedInfoSchema.validate(linkData);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._linkData = value;
        }
    }
};
