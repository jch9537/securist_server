const { GetUserBelongingCompanyInfo } = require('../user');
//Entity 생성해야함!!!
module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, tempData, uploadData) {
        let result;
        try {
            if (userData.userType === 2) {
                let getUserBelongingCompanyInfo = new GetUserBelongingCompanyInfo(
                    this.Repository
                );
                let companyData = await getUserBelongingCompanyInfo.excute(
                    userData
                );
                console.log('기업정보 가져오기 ', companyData);
                let createProfileTempEntity = tempData; // 유효성 확인 추가!!!
                createProfileTempEntity.companyId =
                    companyData['consulting_company_id'];

                result = await this.Repository.createConsultingCompanyProfileTemp(
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