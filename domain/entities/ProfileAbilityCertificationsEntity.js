'use strict';

module.exports = class ProfileAbilityCertificationsEntity {
    constructor({
        abilityCertificationId,
        certificationId,
        certificationName,
        consultantUserId,
    }) {
        this.abilityCertificationId = abilityCertificationId;
        this.certificationId = certificationId;
        this.certificationName = certificationName;
        this.consultantUserId = consultantUserId;
    }
};
