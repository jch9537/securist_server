module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        try {
            let result = await this.Repository.getCompanyList(userData);
            console.log(' 기업 리스트 결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
