'use strict';

module.exports = class ConsultingCompaniesEntity {
    constructor({
        consultingCompanyId,
        businessLicenseNum,
        companyName,
        presidentName,
        approvalStatus,
        businessLicenseFileName,
        businessLicenseFilePath,
        bankName,
        bankAccountNum,
        bankAccountOwner,
        companyIntroduce,
    }) {
        this.consultingCompanyId = consultingCompanyId;
        this.businessLicenseNum = businessLicenseNum;
        this.companyName = companyName;
        this.presidentName = presidentName;
        this.approvalStatus = approvalStatus;
        this.businessLicenseFileName = businessLicenseFileName;
        this.businessLicenseFilePath = businessLicenseFilePath;
        this.bankName = bankName;
        this.bankAccountNum = bankAccountNum;
        this.bankAccountOwner = bankAccountOwner;
        this.companyIntroduce = companyIntroduce;
    }
};
