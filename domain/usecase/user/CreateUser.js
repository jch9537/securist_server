module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    excute(userEntity) {
        console.log('userEntity Usecase : ', userEntity);
        let result;
        try {
            result = this.Repository.createUser(userEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
};
