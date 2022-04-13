'use strict';

module.exports = class TempProfileAbilityIndustriesEntity {
    constructor({
        tempAbilityIndustryId,
        industryId,
        industryName,
        consultantProfileTempId,
    }) {
        this.tempAbilityIndustryId = tempAbilityIndustryId;
        this.industryId = industryId;
        this.industryName = industryName;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
