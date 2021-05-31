module.exports = class {
    constructor({ relationRepository }) {
        this.relationRepository = relationRepository;
    }
    async excute(userData) {
        try {
            let result = await this.relationRepository.getRelationInfo(
                userData
            );
            console.log('relation info결과----------------', result);
            return result;
        } catch (error) {
            console.log('relation info 에러 ----------------', error);
            throw error;
        }
    }
};
