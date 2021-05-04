const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, companyData) {
        try {
            let companyEntity = new CompanyEntity(companyData);
            companyEntity.userType = userData.userType;

            let result = await this.Repository.getCompanyBelongedUsersInfo(
                companyEntity
            );
            console.log('클라이언트 기업 결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
