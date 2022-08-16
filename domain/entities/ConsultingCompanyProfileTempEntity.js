'use strict';

module.exports = class ConsultantProfileTempEntity {
    constructor({
        consultingCompanyProfileTempId,
        companyIntroduce,
        businessLicenseFileName,
        businessLicenseFilePath,
        consultingCompanyId,
    }) {
        this.consultingCompanyProfileTempId = consultingCompanyProfileTempId;
        this.companyIntroduce = companyIntroduce;
        this.businessLicenseFileName = businessLicenseFileName;
        this.businessLicenseFilePath = businessLicenseFilePath;
        this.consultingCompanyId = consultingCompanyId;
    }
};
