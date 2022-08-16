'use strict';

module.exports = class ProfileLicenseEntity {
    constructor({
        licenseId,
        licenseName,
        licenseNum,
        issueInstitution,
        issuedDate,
        consultantUserId,
    }) {
        this.licenseId = licenseId;
        this.licenseName = licenseName;
        this.licenseNum = licenseNum;
        this.issueInstitution = issueInstitution;
        this.issuedDate = issuedDate;
        this.consultantUserId = consultantUserId;
    }
};
