const { NoContent } = require('../../exceptions');
module.exports = class {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }
    async excute(userData) {
        try {
            let result = await this.userRepository.getUserInfo(userData);

            if (result === undefined) {
                throw new NoContent('사용자 정보가');
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
};
