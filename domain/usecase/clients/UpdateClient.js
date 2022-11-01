const { ClientUsersEntity } = require('../../entities');
module.exports = class UpdateClient {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        let { clientUsersRepository } = this.repository;
        try {
            let clientUsersEntity = new ClientUsersEntity(userData);

            await clientUsersRepository.updateClientUser(clientUsersEntity);

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
