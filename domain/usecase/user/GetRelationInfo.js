module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        try {
            let result = await this.userRepository.getRelationInfo(userData);
            console.log('relation info결과----------------', result);
            return result;
        } catch (error) {
            console.log('relation info 에러 ----------------', error);
            throw error;
        }
    }
};
