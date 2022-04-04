// 수정
module.exports = class GetConsultingCompanyInfoResponseDto {
    constructor(companyData) {
        this.companyData = companyData;
    }
    get companyData() {
        return this._companyData;
    }
    set companyData(companyData) {
        this._companyData = {
            consultingCompanyId: companyData['client_company_id'],
            businessLicenseNum: companyData['business_license_num'],
            companyName: companyData['company_name'],
            presidentName: companyData['president_name'],
            approvalState: companyData['approval_state'],
            createDate: companyData['create_date:'],
            deleteDate: companyData['delete_date'],
            businessLicenseFile: companyData['business_license_file'],
            businessLicenseFilePath: companyData['business_license_file_path'],
            bankName: companyData['bank_name'],
            bankAccount_num: companyData['bank_account_num'],
            bankAccountOwner: companyData['bank_account_owner'],
            companyIntroduce: companyData['company_introduce'],
        };
    }
};
