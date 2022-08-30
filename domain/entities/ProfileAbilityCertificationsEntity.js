'use strict';

module.exports = class ProfileAbilityCertificationsEntity {
    constructor({
        abilityCertificationId,
        certificationId,
        // certificationName,
        profileId,
    }) {
        this.abilityCertificationId = abilityCertificationId;
        this.certificationId = certificationId;
        // this.certificationName = certificationName;
        this.profileId = profileId;
    }
};
