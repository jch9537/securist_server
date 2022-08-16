const { ClientUsersEntity } = require('../../../entities');
module.exports = class GetClientUser {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        let { clientUsersRepository } = this.repository;
        try {
            let clientUsersEntity = new ClientUsersEntity(userData);
            let clientUserInfo = await clientUsersRepository.getClientUser(
                clientUsersEntity
            );

            return clientUserInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
