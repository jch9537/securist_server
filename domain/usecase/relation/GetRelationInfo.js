module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        try {
            let result = await this.Repository.getRelationInfo(userData);
            console.log('relation info결과----------------', result);
            return result;
        } catch (error) {
            console.log('relation info 에러 ----------------', error);
            throw error;
        }
    }
};
