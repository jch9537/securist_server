const { UpdatePhoneNumEntity } = require('../../entities/user');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, updateData) {
        console.log(userData);
        let result;

        let updateUserData = {
            email: userData.email,
            userType: userData.userType,
            phoneNum: updateData.phoneNum,
        };
        console.log('업데이트 데이터 : ', updateUserData);
        try {
            let updatePhoneNumEntity = new UpdatePhoneNumEntity(updateUserData);
            result = await this.Repository.updatePhoneNum(updatePhoneNumEntity);
            console.log('결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
