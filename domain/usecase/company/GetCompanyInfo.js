module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, companyId) {
        let result;
        try {
            //entity 추가
            result = await this.Repository.getCompanyInfo(userData, companyId);
            console.log(' 기업 리스트 결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
