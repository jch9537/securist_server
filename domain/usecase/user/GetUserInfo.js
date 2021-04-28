module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        let result;
        try {
            result = await this.Repository.getUserInfo(userData);
        } catch (error) {
            throw error;
        }
        return result;
    }
};
