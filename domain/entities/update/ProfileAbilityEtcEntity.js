'use strict';

module.exports = class ProfileAbilityEtcEntity {
    constructor({
        etcAbilityId,
        etcCertifications,
        etcIndustries,
        consultantUserId,
    }) {
        this.etcAbilityId = etcAbilityId;
        this.etcCertifications = etcCertifications;
        this.etcIndustries = etcIndustries;
        this.consultantUserId = consultantUserId;
    }
};
