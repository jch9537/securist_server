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
    async getManagerList() {
        try {
            let result = await this.db.getManagerList();
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > ManagersRepositoty > getManagerList > error : ',
                error
            );
            throw error;
        }
    }
    async getManager(managerEntity) {
        try {
            let result = await this.db.getManager(managerEntity);
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > ManagersRepositoty > getManager > error : ',
                error
            );
            throw error;
        }
    }
    async updateManager(managerEntity) {
        try {
            let result = await this.db.updateManager(managerEntity);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async deleteManager(managerEntity) {
        // console.log(
        //     '요청 > Adapter > outBound > ManagersRepositoty > deleteManagerByAdmin - parameter: '
        // );
        try {
            let result = await this.db.deleteManager(managerEntity);
            // console.log(
            //     '응답 > Adapter > outBound > ManagersRepositoty > deleteManagerByAdmin > result : ',
            //     result
            // );
            return result;
        } catch (error) {
            // console.log(
            //     '에러 > Adapter > outBound > ManagersRepositoty > deleteManagerByAdmin > error : ',
            //     error
            // );
            throw error;
        }
    }
};
