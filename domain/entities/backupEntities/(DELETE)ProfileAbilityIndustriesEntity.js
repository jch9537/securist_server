'use strict';

module.exports = class ProfileAbilityIndustriesEntity {
    constructor({
        abilityIndustryId,
        industryId,
        // industryName,
        profileId,
    }) {
        this.abilityIndustryId = abilityIndustryId;
        this.industryId = industryId;
        // this.industryName = industryName;
        this.profileId = profileId;
    }
};
