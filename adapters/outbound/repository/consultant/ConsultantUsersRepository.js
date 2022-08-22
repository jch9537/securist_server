// 컨설턴트 사용자
module.exports = class ConsultantUsersRepository {
    constructor(db) {
        this.db = db;
    }
    // async checkExistManager(managerEntity) {
    //     try {
    //         let result = await this.db.checkExistManager(managerEntity);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async createConsultantUser(
        authEntity,
        consultantUserEntity,
        consultingCompaniesEntity,
        consultantUserAndCompanyEntity
    ) {
        try {
            let result = await this.db.createConsultantUser(
                authEntity,
                consultantUserEntity,
                consultingCompaniesEntity,
                consultantUserAndCompanyEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getConsultantUsers() {
        try {
            let result = await this.db.getConsultantUsers();
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getConsultantUser(consultantUsersEntity) {
        try {
            let result = await this.db.getConsultantUser(consultantUsersEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateConsultantUser(consultantUsersEntity) {
        try {
            let result = await this.db.updateConsultantUser(
                consultantUsersEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
