const { RelationEntity } = require('../../entities');
const {
    AuthorizationException,
    ParameterException,
} = require('../../exceptions');

module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData, updateStatusData) {
        let result;
        try {
            let relationEntity = new RelationEntity(updateStatusData);
            relationEntity.userType = userData.userType;
            if (relationEntity.belongingType !== 0) {
                throw new ParameterException('소속 타입 요청');
            }
            result = await this.userRepository.updateUserBelongingStatus(
                relationEntity
            );
            return result;
            // let userType = relationEntity.userType;
            // if (userType === 2 || userType === 3) {
            //     let relationInfo = await this.userRepository.getRelationInfo(
            //         userData
            //     );
            //     let companyBelongingType = relationInfo['belonging_type'];
            //     let companyManagerType = relationInfo['manager_type'];
            //     console.log(
            //         '릴레이션인포------------------------',
            //         companyBelongingType,
            //         companyManagerType
            //     );
            //     // 기업 관리자 권한 확인
            //     if (companyBelongingType !== 2 || companyManagerType !== 1) {
            //         throw new AuthorizationException('소속 정보 수정');
            //     }
            // }
        } catch (error) {
            throw error;
        }
    }
};
