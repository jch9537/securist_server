module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(deleteData) {
        let result;
        try {
            result = await this.Repository.deleteUserAndCompanyRelation(
                deleteData
            );
            console.log('결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
