const { UserEntity } = require('../../entities');
const { CompanyEntity } = require('../../entities');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(signUpData) {
        let result, response;
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
            response = await this.userRepository.signUp(signUpEntity);

            result = {
                message: '회원 가입 완료',
            };
            return result;
        } catch (error) {
            console.error(error);
            if (error.authServiceErrorName === 'UsernameExistsException') {
                error.message = '이미 가입된 사용자 입니다.';
            } else if (
                error.authServiceErrorName === 'InvalidPasswordException'
            ) {
                error.message = '잘못된 암호입니다.'; // 아이디나 비번 틀릴 때 나오는 것 확인
                // } else if (
                //     error.authServiceErrorName === 'InvalidParameterException'
                // ) {
                //     error.message = '유효하지 않은 인자입니다.';
            } else {
                error.message = '회원가입 실패';
            }
            throw error;
        }
    }
};
