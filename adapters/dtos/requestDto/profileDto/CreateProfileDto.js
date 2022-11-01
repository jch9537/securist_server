const { createProfileSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class CreateProfileDto {
    constructor(profileData) {
        this.profileData = profileData;
    }
    get profileData() {
        return this._profileData;
    }
    set profileData(profileData) {
        const { error, value } = createProfileSchema.validate(profileData);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._profileData = value;
        }
    }
};
