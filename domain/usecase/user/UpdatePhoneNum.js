const { UserEntity } = require('../../entities');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, updateData) {
        let updateUserData = {
            email: userData.email,
            userType: userData.userType,
            phoneNum: updateData.phoneNum,
        };
        console.log('업데이트 데이터 : ', updateUserData);
        try {
            let userEntity = new UserEntity(updateUserData);
            let result = await this.Repository.updatePhoneNum(userEntity);
            console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
