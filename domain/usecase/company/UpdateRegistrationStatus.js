const { RelationEntity } = require('../../entities');
const { AuthorizationException } = require('../../exceptions');

module.exports = class {
    constructor({ userRepository, companyRepository }) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }
    async excute(userData, updateStatusData) {
        let result;
        try {
            let relationEntity = new RelationEntity(updateStatusData);
            relationEntity.userType = updateStatusData.userType;
            // let userType = relationEntity.userType;

            // if (userType === 2 || userType === 3) {
            let relationInfo = await this.userRepository.getRelationInfo(
                userData
            );
            let companyBelongingType = relationInfo['belonging_type'];
            let companyManagerType = relationInfo['manager_type'];
            console.log(
                '릴레이션인포------------------------',
                companyBelongingType,
                companyManagerType
            );
            // 기업 관리자 권한 확인
            if (!(companyBelongingType === 2 && companyManagerType === 1)) {
                throw new AuthorizationException('소속 정보 수정');
            }
            // }
            result = await this.companyRepository.updateRegistrationStatus(
                relationEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
