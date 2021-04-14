module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData) {
        let result;
        try {
            if (userData.userType === '3') {
                result = await this.Repository.getClientUserInfo(
                    userData.email
                );
                console.log('결과----------------', result);
            } else {
                result = await this.Repository.getConsultantUserInfo(
                    userData.email
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
