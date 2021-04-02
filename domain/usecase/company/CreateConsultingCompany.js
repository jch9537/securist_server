module.exports = class {
    constructor(Repository) {
        this.Repository = Repository; //DB로 변경
    }
    excute(companyEntity) {
        console.log('CreateConsultingCompany Usecase!!', companyEntity);
        let result = this.Repository.createConsultingCompany(companyEntity);
        return result;
    }
};
