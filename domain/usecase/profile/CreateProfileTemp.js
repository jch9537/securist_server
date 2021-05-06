//Entity 생성해야함!!!
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, tempData) {
        let result;
        try {
            let createProfileTempEntity = tempData;
            createProfileTempEntity.email = userData.email;
            
            result = await this.Repository.createProfileTemp(
                createProfileTempEntity
            );
            // console.log('결과----------------', result);
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
