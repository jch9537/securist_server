//Entity 생성해야함!!!
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, tempData, uploadData) {
        let result;
        try {
            if (userData.userType === 2) {
                let createProfileTempEntity = tempData;
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
