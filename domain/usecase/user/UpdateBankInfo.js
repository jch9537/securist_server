const { UserEntity } = require('../../entities');
const {
    AuthorizationException,
    UserTypeException,
} = require('../../exceptions');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData, updateData) {
        let result, response;
        try {
            if (!(userData.userType === 1 || userData.userType === 2)) {
                throw new UserTypeException('사용자 타입');
            }
            let updateUserData = {
                email: userData.email,
                userType: userData.userType,
                bankName: updateData.bankName,
                bankAccountNum: updateData.bankAccountNum,
                bankAccountOwner: updateData.bankAccountOwner,
            };
            let userEntity = new UserEntity(updateUserData);
            // 기업 관리자 정보 가져오기
            if (userEntity.userType === 2) {
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
                // 기업 관리자 권한 처리
                if (companyBelongingType !== 2 || companyManagerType !== 1) {
                    throw new AuthorizationException('기업 정보 수정');
                }
            }
            response = await this.userRepository.updateBankInfo(userEntity);

            result = {
                message: '입금 정보 변경 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '입금 정보 변경 실패';
            throw error;
        }
    }
};
