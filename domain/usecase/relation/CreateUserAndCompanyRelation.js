module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(joinData) {
        let result;
        try {
            result = await this.Repository.createUserAndCompanyRelation(
                joinData
            );
            console.log('결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
