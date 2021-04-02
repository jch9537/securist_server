module.exports = {
    // clientEntityValidation
    validateBusinessLicenseNum(businessLicenseNum) {
        console.log('validateBusinessLicenseNum : ', businessLicenseNum);
        return businessLicenseNum;
    },
    validateClientName(companyName) {
        console.log('validateClientName', companyName);
        return companyName;
    },
    validatePresidentName(presidentName) {
        console.log('validatePresidentName', presidentName);
        return presidentName;
    },
    // validateCompanyApprovalState(CompanyApprovalState) {},
    // validateSignature(signature) {},
    // validateCompanyDocFile(CompanyDocFile) {},
    validateCreatedAt() {},
    validateDeletedAt() {},
};
