const { ConsultantUsersEntity } = require('../../entities');
module.exports = class UpdateConsultant {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(consultantData) {
        let { consultantUsersRepository } = this.repository;
        try {
            let consultantUsersEntity = new ConsultantUsersEntity(
                consultantData
            );

            await consultantUsersRepository.updateConsultantUser(
                consultantUsersEntity
            );

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
