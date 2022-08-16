'use strict';

module.exports = class TempProfileAbilityCertificationsEntity {
    constructor({
        tempAbilityCertificationId,
        certificationId,
        certificationName,
        consultantProfileTempId,
    }) {
        this.tempAbilityCertificationId = tempAbilityCertificationId;
        this.certificationId = certificationId;
        this.certificationName = certificationName;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
