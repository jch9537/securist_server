const { DeleteUserEntity } = require('../../entities/user');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(token, deleteData) {
        let result;
        try {
            let verifyData = new DeleteUserEntity(deleteData.password);
            let deleteUserEntity = {
                token: token,
                password: verifyData.password,
                userType: deleteData.useType,
                withdrawalType: deleteData.withdrawalType,
                withdrawalText: deleteData.withdrawalText,
            };
            result = this.Repository.deleteUser(deleteUserEntity);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
