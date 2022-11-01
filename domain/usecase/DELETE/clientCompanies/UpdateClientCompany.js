const { ClientCompaniesEntity } = require('../../../entities');
module.exports = class UpdateClientCompany {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        let { clientCompaniesRepository } = this.repository;
        try {
            let clientCompaniesEntity = new ClientCompaniesEntity(userData);

            await clientCompaniesRepository.updateClientCompany(
                clientCompaniesEntity
            );

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
