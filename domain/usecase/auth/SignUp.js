const { SignUpEntity } = require('../../entities/auth');
const { CompanyEntity } = require('../../entities/company');
module.exports = class {
    constructor(Auth, Repository) {
        this.Auth = Auth;
        this.Repository = Repository;
    }
    async excute(userParam) {
        let result;
        // 사용자 유효성 확인
        let signUpData = {
            email: userParam.email,
            password: userParam.password,
            name: userParam.name,
            userType: userParam.userType,
            phoneNum: userParam.phoneNum,
        };
        let signUpEntity = new SignUpEntity(signUpData);
        let userType = signUpEntity.userType;
        //userType - 1: 개인 컨설턴트 2: 컨설팅업체 3: 클라이언트 기업
        try {
            if (userType === '2' || userType === '3') {
                //기업 정보 유효성 확인
                let companyData = {
                    businessLicenseNum: userParam.businessLicenseNum,
                    companyName: userParam.companyName,
                    presidentName: userParam.presidentName,
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
