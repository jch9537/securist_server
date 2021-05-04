const { UserEntity } = require('../../entities');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(accessToken, withdrawalData) {
        try {
            let userEntity = new UserEntity(withdrawalData);
            // let withdrawalEntity = {
            //     email: withdrawalData.email,
            //     userType: withdrawalData.userType,
            //     withdrawalType: deleteUserEntity.withdrawalType,
            // };
            // console.log('-------------------------', withdrawalEntity);
            let result = this.Repository.deleteUser(accessToken, userEntity);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
