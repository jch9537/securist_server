const { RelationEntity } = require('../../entities');
const {
    AuthorizationException,
    ParameterException,
    UserTypeException,
} = require('../../exceptions');

module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData, updateStatusData) {
        let result, response;
        try {
            // userData.userType = 1; //테스트용
            if (userData.userType === 1) {
                updateStatusData = {
                    userType: userData.userType,
                    companyId: updateData.companyId,
                    email: userData.email,
                    // email: 'mg.sun@aegisecu.com', //테스트용
                    belongingType: updateData.belongingType,
                };
            } else {
                // if (userData.userType === 3) {
                //     companyIdColumn = 'client_company_id';
                // } else if (userData.userType === 2) {
                //     companyIdColumn = 'consulting_company_id';
                // }
                // let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
                //     userData
                // );
                // let companyId = companyInfo[companyIdColumn];
                // updateStatusData = {
                //     userType: userData.userType,
                //     companyId: companyId,
                //     email: updateData.userId,
                //     belongingType: updateData.belongingType,
                // };
                throw new UserTypeException('사용자');
            }

            let relationEntity = new RelationEntity(updateStatusData);
            relationEntity.userType = userData.userType;
            if (relationEntity.belongingType !== 0) {
                throw new ParameterException('소속 타입 요청');
            }
            response = await this.userRepository.updateUserBelongingStatus(
                relationEntity
            );

            if (response.length === 0) {
                result = {
                    message: '소속 기업이 없는 사용자 입니다.',
                };
            } else {
                result = {
                    message: '소속 취소 처리 완료',
                    data: response,
                };
            }
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
            console.error(error);
            error.message = '소속 취소 처리 실패';
            throw error;
        }
    }
};
