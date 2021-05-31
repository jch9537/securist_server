//Entity 생성
module.exports = class {
    constructor({ profileRepository }) {
        this.profileRepository = profileRepository;
    }
    async excute(userData) {
        try {
            let result = await this.profileRepository.deleteProfileTemp(
                userData
            );
            console.log('결과----------------', result);
            return result;
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
    }
};
