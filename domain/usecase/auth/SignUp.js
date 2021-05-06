const { UserEntity } = require('../../entities');
const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor(Auth, Repository) {
        this.Auth = Auth;
        this.Repository = Repository;
    }
    async excute(signUpData) {
        let result;

        let signUpEntity = new UserEntity(signUpData);
        let userType = signUpEntity.userType;
        //userType - 1: 개인 컨설턴트 2: 컨설팅업체 3: 클라이언트 기업
        console.log('11^^^^^^^^^^^^^^^^^^^^^^^^^^', signUpEntity);
        try {
            if (userType === 2 || userType === 3) {
                //기업 정보 유효성 확인
                console.log('22^^^^^^^^^^^^^^^^^^^^^^^^^^', signUpEntity);

                let companyData = {
                    businessLicenseNum: signUpData.businessLicenseNum,
                    companyName: signUpData.companyName,
                    presidentName: signUpData.presidentName,
                };
                // 기업(클라이언트, 컨설턴트) 정보 유효성 확인
                let companyEntity = new CompanyEntity(companyData);

                signUpEntity.businessLicenseNum =
                    companyEntity.businessLicenseNum;
                signUpEntity.companyName = companyEntity.companyName;
                signUpEntity.presidentName = companyEntity.presidentName;
            }
            result = await this.Repository.signUp(signUpEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
};
