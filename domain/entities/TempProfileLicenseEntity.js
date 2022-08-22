'use strict';

module.exports = class TempProfileLicenseEntity {
    constructor({
        tempLicenseId,
        licenseName,
        licenseNum,
        issueInstitution,
        issuedDate,
        consultantProfileTempId,
    }) {
        this.tempLicenseId = tempLicenseId;
        this.licenseName = licenseName;
        this.licenseNum = licenseNum;
        this.issueInstitution = issueInstitution;
        this.issuedDate = issuedDate;
        this.consultantProfileTempId = consultantProfileTempId;
    }
};
