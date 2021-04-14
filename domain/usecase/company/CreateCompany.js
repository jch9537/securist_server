//  기업 생성
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    excute(companyEntity) {
        console.log('CreateCompany!!', companyEntity);
        let result;
        try {
            result = this.Repository.createCompany(companyEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
};
