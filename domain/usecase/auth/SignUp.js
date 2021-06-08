const { UserEntity } = require('../../entities');
const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(signUpData) {
        let result;
        try {
            let signUpEntity = new UserEntity(signUpData);
            let userType = signUpEntity.userType;
            //userType - 1: 개인 컨설턴트 2: 컨설팅업체 3: 클라이언트 기업
            if (userType === 2 || userType === 3) {
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
            result = await this.userRepository.signUp(signUpEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
