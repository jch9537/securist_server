//TODO : 여기에서 클라이언트냐 컨설턴트 기업이냐를 나눠서 처리해야함 ... 잘못처리했음

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
