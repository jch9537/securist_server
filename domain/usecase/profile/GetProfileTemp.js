module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData) {
        let result;
        try {
            // userData.userType = 1; // 테스트용
            if (userData.userType === 1) {
                result = await this.profileRepository.getConsultantProfileTemp(
                    userData
                );
                console.log('결과----------------', result);
            } else if (userData.userType === 2) {
                result = await this.profileRepository.getConsultingCompanyProfileTemp(
                    userData
                );
                console.log('결과----------------', result);
            }
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
