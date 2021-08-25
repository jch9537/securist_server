const { UserEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        let result, response;
        try {
            let userEntity = new UserEntity(userData);

            let userType = userEntity.userType;
            if (!(userType === 1 || userType === 2 || userType === 3)) {
                throw new UserTypeException('사용자 타입');
            }
            response = await this.userRepository.getUserBelongingCompanyInfo(
                userEntity
            );
            result = {
                message: '사용자 소속 기업 정보 가져오기 완료',
                data: response,
            };
            return result;
        } catch (error) {
            console.error(error);
            error.message = '사용자 소속 기업 정보 가져오기 실패';
            throw error;
        }
    }
};
