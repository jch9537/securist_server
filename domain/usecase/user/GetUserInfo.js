module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        try {
            let result = await this.userRepository.getUserInfo(userData);
            return result;
        } catch (error) {
            throw error;
        }
    }
};
