//Entity 생성해야함!!!
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, tempData, uploadData) {
        let result;
        try {
            userData.userType = 1; // 테스트용
            if (userData.userType === 1) {
                let createProfileTempEntity = tempData; // 유효성 확인 추가!!!
                createProfileTempEntity.email = userData.email;

                result = await this.Repository.createConsultantProfileTemp(
                    createProfileTempEntity,
                    uploadData
                );
            }
            // console.log('결과----------------', result);
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
