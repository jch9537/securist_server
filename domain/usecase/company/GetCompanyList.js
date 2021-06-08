module.exports = class {
    constructor({ companyRepository }) {
        this.companyRepository = companyRepository;
    }
    async excute(userData) {
        try {
            let result = await this.companyRepository.getCompanyList(userData);
            console.log(' 기업 리스트 결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
