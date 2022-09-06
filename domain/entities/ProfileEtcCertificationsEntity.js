'use strict';

module.exports = class ProfileEtcCertificationsEntity {
    constructor({ etcCertificationId, etcCertifications, profileId }) {
        this.etcCertificationId = etcCertificationId;
        this.etcCertifications = etcCertifications;
        this.profileId = profileId;
    }
};
