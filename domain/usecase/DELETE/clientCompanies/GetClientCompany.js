const { ClientCompaniesEntity } = require('../../../entities');
module.exports = class GetClientCompany {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        let { clientCompaniesRepository } = this.repository;
        try {
            let clientCompaniesEntity = new ClientCompaniesEntity(userData);
            let clientCompanyInfo = await clientCompaniesRepository.getClientCompany(
                clientCompaniesEntity
            );

            return clientCompanyInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
