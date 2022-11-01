'use strict';

module.exports = class TempEtcCertificationsEntity {
    constructor({ etcCertificationId, etcCertifications, tempProfileId }) {
        this.etcCertificationId = etcCertificationId;
        this.etcCertifications = etcCertifications;
        this.tempProfileId = tempProfileId;
    }
};
