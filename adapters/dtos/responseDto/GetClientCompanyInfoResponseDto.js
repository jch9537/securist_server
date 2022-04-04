module.exports = class GetClientCompanyInfoResponseDto {
    constructor(companyData) {
        this.companyData = companyData;
    }
    get companyData() {
        return this._companyData;
    }
    set companyData(companyData) {
        this._companyData = {
            clientCompanyId: companyData['client_company_id'],
            businessLicenseNum: companyData['business_license_num'],
            companyName: companyData['company_name'],
            presidentName: companyData['president_name'],
            approvalState: companyData['approval_state'],
            createDate: companyData['create_date:'],
            deleteDate: companyData['delete_date'],
            businessLicenseFile: companyData['business_license_file'],
            businessLicenseFilePath: companyData['business_license_file_path'],
            signatureFile: companyData['signature_file'],
            signatureFilePath: companyData['signature_file_path'],
        };
    }
};
