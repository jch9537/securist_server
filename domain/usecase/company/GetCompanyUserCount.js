module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, companyId) {
        let result;
        try {
            result = await this.Repository.getCompanyUserCount(
                userData,
                companyId
            );
            console.log('클라이언트 기업 결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
