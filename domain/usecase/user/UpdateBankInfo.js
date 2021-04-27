const { UpdateBankInfoEntity } = require('../../entities/user');

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
                let updateBankInfoEntity = new UpdateBankInfoEntity(
                    updateUserData
                );
                // console.log('업데이트 데이터 : ', updateUserData);
                result = await this.Repository.updateCompanyBankInfo(
                    updateBankInfoEntity
                );
                // console.log('결과----------------', result);
            } catch (error) {
                // console.log('에러 ----------------', error);
                throw error;
            }
            return result;
        } else {
            throw error; // 사용자 타입오류
        }
    }
};
