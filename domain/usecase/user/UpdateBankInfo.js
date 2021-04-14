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
                userType: userData.userType,
                bankName: updateData.bankName,
                bankAccountNum: updateData.bankAccountNum,
                bankAccountOwner: updateData.bankAccountOwner,
            };
            let updateBankInfoEntity;
            if (userData.usertype === '1') {
                updateUserData.id = userData.email;
                updateBankInfoEntity = new UpdateBankInfoEntity(
                    updateUserData
                );
            } else {
                // email로 기업id 가져오기
                updateUserData.id = userData.email;
                updateBankInfoEntity = new UpdateBankInfoEntity(
                    updateUserData
                );
            }
            console.log('업데이트 데이터 : ', updateUserData);
            try {
                result = await this.Repository.updateBankInfo(
                    updateBankInfoEntity
                );
                console.log('결과----------------', result);
            } catch (error) {
                console.log('에러 ----------------', error);
                throw error;
            }
            return result;
        } else {
            throw error; // 사용자 타입오류
        }
    }
};
