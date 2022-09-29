module.exports = class GetConsultants {
    constructor(repository) {
        this.repository = repository;
    }
    async excute() {
        let { consultantUsersRepository } = this.repository;
        try {
            let consultantUsersInfo = await consultantUsersRepository.getConsultantUsers();

            return consultantUsersInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
