// 클라이언트 사용자
module.exports = class ClientUsersRepository {
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
    async createClientUser(
        authEntity,
        clientUserEntity,
        clientCompaniesEntity,
        clientUserAndCompanyEntity
    ) {
        try {
            let result = await this.db.createClientUser(
                authEntity,
                clientUserEntity,
                clientCompaniesEntity,
                clientUserAndCompanyEntity
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getClientUsers() {
        try {
            let result = await this.db.getClientUsers();
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getClientUser(clientUsersEntity) {
        try {
            let result = await this.db.getClientUser(clientUsersEntity);
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > ManagersRepositoty > getManager > error : ',
                error
            );
            throw error;
        }
    }
    async updateClientUser(clientUsersEntity) {
        try {
            let result = await this.db.updateClientUser(clientUsersEntity);
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
            console.log(
                '에러 > Adapter > outBound > ClientUsersRepository > getClientUsers > error : ',
                error
            );
            throw error;
        }
    }
};
