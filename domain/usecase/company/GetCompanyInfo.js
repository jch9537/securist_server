const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor({ companyRepository }) {
        this.companyRepository = companyRepository;
    }
    async excute(userData, companyData) {
        try {
            let companyEntity = new CompanyEntity(companyData);
            companyEntity.userType = userData.userType;

            let result = await this.companyRepository.getCompanyInfo(
                companyEntity
            );
            console.log(' 기업 리스트 결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
