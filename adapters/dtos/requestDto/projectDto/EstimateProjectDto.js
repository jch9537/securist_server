const { estimateProjectSchema } = require('../../../module/joi');
const { ValidationException } = require('../../../../domain/exceptions');

module.exports = class EstimateProjectDto {
    constructor(projectData) {
        this.projectData = projectData;
    }
    get projectData() {
        return this._projectData;
    }
    set projectData(projectData) {
        let { error, value } = estimateProjectSchema.validate(projectData);
        // console.log('필터 조건2 ', value);
        if (error) {
            let errorProperty = error.details[0].context.key;
            console.log('유효성 에러위치', errorProperty);

            throw new ValidationException(error.message);
        } else {
            this._projectData = value;
        }
    }
};
