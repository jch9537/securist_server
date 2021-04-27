module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        let result;
        try {
            if (userData.userType === '3') {
                // 이것도 infra에서 분류하는 걸로 수정
                result = await this.Repository.getClientUserInfo(
                    userData.email
                );
            } else {
                result = await this.Repository.getConsultantUserInfo(
                    userData.email
                );
            }
        } catch (error) {
            throw error;
        }
        return result;
    }
};
