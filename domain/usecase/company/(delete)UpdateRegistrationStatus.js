module.exports = class {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async excute(userData, regiData) {
        let result;
        try {
            //entity 유효성 코드 추가
            result = await this.Repository.updateRegistrationStatus(
                userData,
                regiData
            );
            console.log('클라이언트 기업 결과----------------', result);
        } catch (error) {
            console.log('에러 ----------------', error);
            throw error;
        }
        return result;
    }
};
