'use strict';

module.exports = class ProfileLicenseEntity {
    constructor({
        licenseId,
        licenseName,
        licenseNum,
        issueInstitution,
        issuedDate,
        licenseScore,
        profileId,
    }) {
        this.licenseId = licenseId;
        this.licenseName = licenseName;
        this.licenseNum = licenseNum;
        this.issueInstitution = issueInstitution;
        this.issuedDate = issuedDate;
        this.licenseScore = licenseScore;
        this.profileId = profileId;
    }
};
