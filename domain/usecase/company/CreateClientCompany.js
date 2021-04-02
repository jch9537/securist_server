module.exports = class {
    constructor(Repository) {
        this.Repository = Repository; //DB로 변경
    }
    excute(companyEntity) {
        console.log('CreateClientCompany Usecase!!', companyEntity);
        let result = this.Repository.createClientCompany(companyEntity);
        return result;
    }
};
