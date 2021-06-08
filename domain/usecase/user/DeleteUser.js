const { UserEntity } = require('../../entities');

module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
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
            let result = this.userRepository.deleteUser(
                accessToken,
                userEntity
            );
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
