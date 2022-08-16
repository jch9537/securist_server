module.exports = class GetClientUsers {
    constructor(repository) {
        this.repository = repository;
    }
    async excute() {
        let { clientUsersRepository } = this.repository;
        try {
            let clientUsersInfo = await clientUsersRepository.getClientUsers();

            return clientUsersInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
