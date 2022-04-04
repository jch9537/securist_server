const { UserEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData, clientData, uploadData) {
        let result, response;
        try {
            if (userData.userType !== 3) {
                throw new UserTypeException('사용자 타입');
            }
            let userEntity = new UserEntity(clientData);
            // let createProfileTempEntity = clientData; // 유효성 확인 추가!!!
            userEntity.email = userData.email;
            userEntity.userType = userData.userType;

            await this.profileRepository.requestClientAuth(
                userEntity,
                uploadData
            );

            result = {
                message: '사업자 인증 요청 완료',
            };
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.error(error);
            error.message = '사업자 인증 요청 실패';
            throw error;
        }
    }
};
