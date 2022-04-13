'use strict';

module.exports = class ClientCompaniesEntity {
    constructor({
        clientCompanyId,
        businessLicenseNum,
        companyName,
        presidentName,
        approvalStatus,
        businessLicenseFileName,
        businessLicenseFilePath,
        signatureFileName,
        signatureFilePath,
    }) {
        this.clientCompanyId = clientCompanyId;
        this.businessLicenseNum = businessLicenseNum;
        this.companyName = companyName;
        this.presidentName = presidentName;
        this.approvalStatus = approvalStatus;
        this.businessLicenseFileName = businessLicenseFileName;
        this.businessLicenseFilePath = businessLicenseFilePath;
        this.signatureFileName = signatureFileName;
        this.signatureFilePath = signatureFilePath;
    }
};
