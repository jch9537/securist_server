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

            if (userType === 1) {
                response = await this.profileRepository.getConsultantProfileTemp(
                    userData
                );
                result = {
                    message: '컨설턴트 프로필 임시 정보 가져오기 완료',
                    data: response,
                };
                console.log('결과----------------', result);
            } else {
                // userData.userType === 2
                response = await this.profileRepository.getConsultingCompanyProfileTemp(
                    userData
                );
                result = {
                    message: '기업 프로필 임시 정보 가져오기 완료',
                    data: response,
                };
                console.log('결과----------------', result);
            }
            return result;
        } catch (error) {
            console.error(error);
            error.message = '프로필 임시 정보 가져오기 실패';
            throw error;
        }
    }
};
