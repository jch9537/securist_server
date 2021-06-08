const { CompanyEntity } = require('../../entities');
const { AuthorizationException } = require('../../exceptions');
module.exports = class {
    constructor({ companyRepository, userRepository }) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }
    async excute(userData, companyData) {
        let result;
        try {
            let companyEntity = new CompanyEntity(companyData);
            companyEntity.userType = userData.userType;
            let userType = companyEntity.userType;

            if (!(userType === 2 || userType === 3)) {
                throw new AuthorizationException('소속 컨설턴트 정보 가져오기');
            }
            let relationInfo = await this.userRepository.getRelationInfo(
                userData
            );

            let companyBelongingType = relationInfo['belonging_type'];
            let companyManagerType = relationInfo['manager_type'];
            // 기업 관리자 권한 확인
            if (companyBelongingType !== 2 || companyManagerType !== 1) {
                throw new AuthorizationException('소속 컨설턴트 정보 가져오기');
            }
            result = await this.companyRepository.getCompanyBelongedUsersInfo(
                companyEntity
            );
            console.log('클라이언트 기업 결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
