'use strict';

module.exports = class ProfileAbilityIndustriesEntity {
    constructor({
        abilityIndustryId,
        industryId,
        industryName,
        consultantUserId,
    }) {
        this.abilityIndustryId = abilityIndustryId;
        this.industryId = industryId;
        this.industryName = industryName;
        this.consultantUserId = consultantUserId;
    }
};
