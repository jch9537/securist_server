'use strict';

module.exports = class ClientCompaniesEntity {
    constructor({
        clientCompanyId,
        businessLicenseNum,
        companyName,
        industryId,
        industryName,
        presidentName,
        address,
        approvalStatus,
        businessLicenseFileName,
        businessLicenseFilePath,
        signatureFileName,
        signatureFilePath,
        createAt,
        deletedAt,
    }) {
        this.clientCompanyId = clientCompanyId;
        this.businessLicenseNum = businessLicenseNum;
        this.companyName = companyName;
        this.industryId = industryId;
        this.industryName = industryName;
        this.presidentName = presidentName;
        this.address = address;
        this.approvalStatus = approvalStatus;
        this.businessLicenseFileName = businessLicenseFileName;
        this.businessLicenseFilePath = businessLicenseFilePath;
        this.signatureFileName = signatureFileName;
        this.signatureFilePath = signatureFilePath;
        this.createAt = createAt;
        this.deletedAt = deletedAt;
    }
};
