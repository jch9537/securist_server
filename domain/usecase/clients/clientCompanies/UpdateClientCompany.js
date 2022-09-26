const { ClientCompaniesEntity } = require('../../../entities');
module.exports = class UpdateClientCompany {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        const { clientCompaniesRepository } = this.repository;
        try {
            const clientCompaniesEntity = new ClientCompaniesEntity(userData);

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
