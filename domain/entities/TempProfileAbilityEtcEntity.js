'use strict';

module.exports = class TempProfileAbilityEtcEntity {
    constructor({
        tempEtcAbilityId,
        etcCertifications,
        etcIndustries,
        consultantProfileTempId,
    }) {
        this.tempEtcAbilityId = tempEtcAbilityId;
        this.etcCertifications = etcCertifications;
        this.etcIndustries = etcIndustries;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
