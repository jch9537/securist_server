module.exports = class {
    constructor({userRepository}) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        try {
            let result = await this.userRepository.getUserBelongingCompanyInfo(
                userData
            );
            // console.log('결과----------------', result);
            return result;
        } catch (error) {
            // console.log('에러 ----------------', error);
            throw error;
        }
    }
};
