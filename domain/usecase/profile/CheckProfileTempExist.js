const { UserTypeException } = require('../../exceptions');
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData) {
        let result, response;
        try {
            let userType = userData.userType;
            if (!(userType === 1 || userType === 2)) {
                throw new UserTypeException('사용자 타입');
            }

            response = await this.profileRepository.checkProfileTempExist(
                userData
            );
            if (response === 0) {
                result = {
                    message: '임시 저장된 데이터가 없습니다.',
                    data: {
                        profileTempExist: !!response,
                    },
                };
            } else {
                result = {
                    message: '임시 저장 데이터가 존재합니다.',
                    data: {
                        profileTempExist: !!response,
                    },
                };
            }
            console.log('결과----------------', result);

            return result;
        } catch (error) {
            console.error(error);
            error.message = '임시저장 데이터 여부 확인 실패';
            throw error;
        }
    }
};
