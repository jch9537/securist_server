module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        try {
            let result = await this.Repository.getUserInfo(userData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
