'use strict';

module.exports = class ProfileAbilityEtcEntity {
    constructor({ etcAbilityId, etcCertifications, etcIndustries, profileId }) {
        this.etcAbilityId = etcAbilityId;
        this.etcCertifications = etcCertifications;
        this.etcIndustries = etcIndustries;
        this.profileId = profileId;
    }
};
