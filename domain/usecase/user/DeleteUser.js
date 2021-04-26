const { DeleteUserEntity } = require('../../entities/user');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(accessToken, withdrawalData) {
        let result;
        try {
            let deleteUserEntity = new DeleteUserEntity(
                withdrawalData.withdrawalType
            );
            let withdrawalEntity = {
                email: withdrawalData.email,
                userType: withdrawalData.userType,
                withdrawalType: deleteUserEntity.withdrawalType,
            };
            console.log('-------------------------', withdrawalEntity);
            result = this.Repository.deleteUser(accessToken, withdrawalEntity);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
