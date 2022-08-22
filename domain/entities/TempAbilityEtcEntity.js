'use strict';

module.exports = class TempAbilityEtcEntity {
    constructor({
        tempEtcAbilityId,
        etcCertification,
        etcIndustry,
        tempProfileId,
    }) {
        this.tempEtcAbilityId = tempEtcAbilityId;
        this.etcCertification = etcCertification;
        this.etcIndustry = etcIndustry;
        this.tempProfileId = tempProfileId;
    }
};
