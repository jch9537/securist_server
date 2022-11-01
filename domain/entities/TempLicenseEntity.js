'use strict';

module.exports = class TempLicenseEntity {
    constructor({
        tempLicenseId,
        licenseName,
        licenseNum,
        issueInstitution,
        issuedDate,
        tempProfileId,
    }) {
        this.tempLicenseId = tempLicenseId;
        this.licenseName = licenseName;
        this.licenseNum = licenseNum;
        this.issueInstitution = issueInstitution;
        this.issuedDate = issuedDate;
        this.tempProfileId = tempProfileId;
    }
};
