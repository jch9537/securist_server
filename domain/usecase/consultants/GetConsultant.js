const { ConsultantUsersEntity } = require('../../entities');
module.exports = class GetConsultant {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(consultantData) {
        let { consultantUsersRepository } = this.repository;
        try {
            let consultantUsersEntity = new ConsultantUsersEntity(
                consultantData
            );
            let consultantUserInfo = await consultantUsersRepository.getConsultantUser(
                consultantUsersEntity
            );

            return consultantUserInfo;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
