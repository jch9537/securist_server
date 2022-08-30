const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData) {
        let result, response;
        try {
            if (!(userData.userType === 1 || userData.userType === 2)) {
                throw new UserTypeException('사용자 타입');
            }
            response = await this.profileRepository.deleteProfileTemp(userData);
            if (response !== undefined) {
                if (response === 0) {
                    result = {
                        message: '임시 저장된 프로필이 없습니다.',
                    };
                }
            } else {
                result = {
                    message: '프로필 임시 저장 정보 삭제 완료',
                };
            }
            console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.error(error);
            error.message = '프로필 임시 저장 정보 삭제 실패';
            throw error;
        }
    }
};
