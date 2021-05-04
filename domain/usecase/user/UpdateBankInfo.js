const { UserEntity } = require('../../entities');
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, updateData) {
        console.log(userData);
        let result;
        if (userData.userType === '1' || userData.userType === '2') {
            let updateUserData = {
                email: userData.email,
                userType: userData.userType,
                bankName: updateData.bankName,
                bankAccountNum: updateData.bankAccountNum,
                bankAccountOwner: updateData.bankAccountOwner,
            };

            try {
                let userEntity = new UserEntity(updateUserData);
                // console.log('업데이트 데이터 : ', updateUserData);
                result = await this.Repository.updateBankInfo(userEntity);
                // console.log('결과----------------', result);
            } catch (error) {
                // console.log('에러 ----------------', error);
                throw error;
            }
            return result;
        }
    }
};
