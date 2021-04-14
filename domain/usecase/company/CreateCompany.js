//  기업 생성
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    excute(companyEntity) {
        let result;
        try {
            console.log('CreateCompany Usecase!!', companyEntity);
            result = this.Repository.createCompany(companyEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
};
