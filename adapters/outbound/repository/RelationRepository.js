module.exports = class {
    constructor(db) {
        this.db = db;
    }
    // 사용자-기업 관계--------------------------------------------------------------------
    // CREATE
    async createUserAndCompanyRelation(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > createUserAndCompanyRelation > companyEntity: ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.createUserAndCompanyRelation(companyEntity);
            console.log(
                '응답 > Adapter > outBound > repository > createUserAndCompanyRelation > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // GET
    async getRelationInfo(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getRelationInfo > userData : ',
            userData
        );
        let result;
        try {
            result = await this.db.getRelationInfo(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getRelationInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }

    // UPDATE
    async updateBelongingStatus(relationEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateBelongingStatus > relationEntity: ',
            relationEntity
        );
        try {
            let result = await this.db.updateBelongingStatus(relationEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updateBelongingStatus > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > updateBelongingStatus > error : ',
                error
            );
            throw error;
        }
    }

    // DELETE
    async deleteUserAndCompanyRelation(deleteData) {
        console.log(
            '요청 > Adapter > outBound > repository > deleteUserAndCompanyRelation > deleteData: ',
            deleteData
        );
        let result;
        try {
            result = await this.db.deleteUserAndCompanyRelation(deleteData);
            console.log(
                '응답 > Adapter > outBound > repository > deleteUserAndCompanyRelation > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
