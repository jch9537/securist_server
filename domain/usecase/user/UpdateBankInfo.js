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
                // userType 을 포함시키고 infra에서 나누는 걸로 수정
                if (userData.userType === '1') {
                    console.log('업데이트 데이터1 : ', updateUserData);
                    result = await this.Repository.updateUserBankInfo(
                        updateBankInfoEntity
                    );
                } else {
                    console.log('업데이트 데이터2 : ', updateUserData);
                    result = await this.Repository.updateCompanyBankInfo(
                        updateBankInfoEntity
                    );
                }
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
