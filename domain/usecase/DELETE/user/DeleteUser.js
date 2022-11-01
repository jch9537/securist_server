const { UserEntity } = require('../../entities');

module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(accessToken, withdrawalData) {
        let result, response;
        try {
            let userEntity = new UserEntity(withdrawalData);
            // let withdrawalEntity = {
            //     email: withdrawalData.email,
            //     userType: withdrawalData.userType,
            //     withdrawalType: deleteUserEntity.withdrawalType,
            // };
            // console.log('-------------------------', withdrawalEntity);
            response = this.userRepository.deleteUser(accessToken, userEntity);

            result = {
                message: '회원 탈퇴 완료',
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '회원 탈퇴 실패';
            throw error;
        }
    }
};
