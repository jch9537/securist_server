const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, joinData) {
        try {
            let companyEntity = new CompanyEntity(joinData);
            companyEntity.userType = userData.userType;
            companyEntity.email = userData.email;
            // companyEntity.email = 'mg.kim@aegisecu.com', // 테스트
            // companyEntity.email = 'mg.sun@aegisecu.com'
            // companyEntity.email = 'ej.lim@aegisecu.com'
            let result = await this.Repository.createUserAndCompanyRelation(
                companyEntity
            );
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
    }
};
