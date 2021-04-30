module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        let result;
        try {
            console.log('기업리스트 요청 ', userData);
            result = await this.Repository.getCompanyList(userData);
            console.log(' 기업 리스트 결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
