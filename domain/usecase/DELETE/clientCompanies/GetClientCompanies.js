module.exports = class GetClientCompanies {
    constructor(repository) {
        this.repository = repository;
    }
    async excute() {
        let { clientCompaniesRepository } = this.repository;
        try {
            let clientCompanies = await clientCompaniesRepository.getClientCompanies();

            return clientCompanies;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
