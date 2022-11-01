// 클라이언트 사용자-기업 연결
module.exports = class LinkedClientUsersCompaniesRepository {
    constructor(db) {
        this.db = db;
    }
    async getLinkedClientUsersCompanies() {
        try {
            let result = await this.db.getLinkedClientUsersCompanies();
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 소속 매니저 확인
    async checkExistClientCompanyManager(linkedClientUsersCompaniesEntity) {
        try {
            let result = await this.db.checkExistClientCompanyManager(
                linkedClientUsersCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 소속된 사용자들의 연결정보 가져오기
    async getLinkedInfoByBelongingClientUsers(
        linkedClientUsersCompaniesEntity
    ) {
        try {
            let result = await this.db.getLinkedInfoByBelongingClientUsers(
                linkedClientUsersCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자의 연결정보 가져오기
    async getLinkedInfoByClientUser(linkedClientUsersCompaniesEntity) {
        try {
            let result = await this.db.getLinkedInfoByClientUser(
                linkedClientUsersCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자 id로 회사 정보 가져오기
    async getClientCompanyInfoByUser(linkedClientUsersCompaniesEntity) {
        try {
            let result = await this.db.getClientCompanyInfoByUser(
                linkedClientUsersCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // async checkExistManager(managerEntity) {
    //     try {
    //         let result = await this.db.checkExistManager(managerEntity);
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
};
