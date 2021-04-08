// 클라이언트 기업 생성
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    excute(companyEntity) {
        let result;
        try {
            console.log('CreateClientCompany Usecase!!', companyEntity);
            result = this.Repository.createClientCompany(companyEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
};
