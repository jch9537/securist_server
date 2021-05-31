const { UserEntity } = require('../../entities');
const { AuthorizationException } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository, relationRepository }) {
        this.userRepository = userRepository;
        this.relationRepository = relationRepository;
    }
    async excute(userData, updateData) {
        console.log(userData);
        let result;
        if (userData.userType === 1 || userData.userType === 2) {
            let updateUserData = {
                email: userData.email,
                userType: userData.userType,
                bankName: updateData.bankName,
                bankAccountNum: updateData.bankAccountNum,
                bankAccountOwner: updateData.bankAccountOwner,
            };

            try {
                let userEntity = new UserEntity(updateUserData);
                // console.log('업데이트 데이터 : ', updateUserData);
                if (userEntity.userType === 2) {
                    let relationInfo = await this.relationRepository.getRelationInfo(
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
                    if (
                        companyBelongingType !== 2 ||
                        companyManagerType !== 1
                    ) {
                        throw new AuthorizationException('기업 정보 수정');
                    }
                }
                result = await this.userRepository.updateBankInfo(userEntity);
                // console.log('결과----------------', result);
            } catch (error) {
                // console.log('에러 ----------------', error);
                throw error;
            }
            return result;
        }
    }
};
