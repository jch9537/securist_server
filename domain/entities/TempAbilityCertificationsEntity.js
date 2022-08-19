'use strict';

module.exports = class TempAbilityCertificationsEntity {
    constructor({
        tempAbilityCertificationId,
        certificationId,
        tempProfileId,
    }) {
        this.tempAbilityCertificationId = tempAbilityCertificationId;
        this.certificationId = certificationId;
        this.tempProfileId = tempProfileId;
    }
};
