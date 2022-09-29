const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor({ companyRepository }) {
        this.companyRepository = companyRepository;
    }
    async excute(userData, companyData) {
        let result, response;
        try {
            let companyEntity = new CompanyEntity(companyData);
            companyEntity.userType = userData.userType;

            response = await this.companyRepository.getCompanyInfo(
                companyEntity
            );

            result = {
                message: '선택 기업 정보 가져오기 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '선택 기업 정보 가져오기 실패';
            throw error;
        }
    }
};
