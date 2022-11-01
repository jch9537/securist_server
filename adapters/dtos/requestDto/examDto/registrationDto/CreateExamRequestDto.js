const { createExamSchema } = require('../../../../module/joi');
const { ValidationException } = require('../../../../../domain/exceptions');

module.exports = class CreateExamRequestDto {
    constructor(examData) {
        this.examData = examData;
    }
    get examData() {
        return this._examData;
    }
    set examData(examData) {
        const { error, value } = createExamSchema.validate(examData);
        if (error) {
            const errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._examData = value;
        }
    }
};
