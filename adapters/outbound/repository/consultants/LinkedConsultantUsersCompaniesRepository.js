// 컨설턴트 사용자-기업 연결
module.exports = class LinkedConsultantUsersCompaniesRepository {
    constructor(db) {
        this.db = db;
    }
    // 사용자의 연결정보 가져오기
    async getLinkedInfoByConsultantUser(linkedConsultantUsersCompaniesEntity) {
        try {
            let result = await this.db.getLinkedInfoByConsultantUser(
                linkedConsultantUsersCompaniesEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // //
    // async getLinkedConsultantUsersCompanies() {
    //     try {
    //         let result = await this.db.getLinkedConsultantUsersCompanies();
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // // 소속 매니저 확인
    // async checkExistConsultantCompanyManager(
    //     linkedConsultantUsersCompaniesEntity
    // ) {
    //     try {
    //         let result = await this.db.checkExistConsultantCompanyManager(
    //             linkedConsultantUsersCompaniesEntity
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    // // 소속된 사용자들의 연결정보 가져오기
    // async getLinkedInfoByBelongingConsultantUsers(
    //     linkedConsultantUsersCompaniesEntity
    // ) {
    //     try {
    //         let result = await this.db.getLinkedInfoByBelongingConsultantUsers(
    //             linkedConsultantUsersCompaniesEntity
    //         );
    //         return result;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
};
