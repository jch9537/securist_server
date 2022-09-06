'use strict';

module.exports = class TempAbilityIndustriesEntity {
    constructor({ tempAbilityIndustryId, industryId, tempProfileId }) {
        this.tempAbilityIndustryId = tempAbilityIndustryId;
        this.industryId = industryId;
        this.tempProfileId = tempProfileId;
    }
};
