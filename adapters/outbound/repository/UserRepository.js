module.exports = class {
    constructor(db) {
        this.db = db;
    }
    // 사용자--------------------------------------------------------------------
    // CREATE
    async signUp(signUpEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > signUp > signUpEntity : ',
            signUpEntity
        );
        let result;
        try {
            result = await this.db.signUp(signUpEntity);
            console.log(
                '응답 > Adapter > outBound > repository > signUp > result : ',
                result
            );
        } catch (error) {
            console.log(
                '에러 응답 > Adapter > outBound > repository > signUp > result : ',
                error
            );
            throw error;
        }
        return result;
    }
    // GET
    async getUserInfo(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getUserInfo > userData : ',
            userData
        );
        let result;
        try {
            result = await this.db.getUserInfo(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getUserInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async getUserBelongingCompanyInfo(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getUserBelongingCompanyInfo > userData : ',
            userData
        );
        let result;
        try {
            result = await this.db.getUserBelongingCompanyInfo(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getUserBelongingCompanyInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    // UPDATE
    async updatePhoneNum(updatePhoneNumEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updatePhoneNum > updatePhoneNumEntity : ',
            updatePhoneNumEntity
        );
        let result;
        try {
            result = await this.db.updatePhoneNum(updatePhoneNumEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updatePhoneNum > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async updateBankInfo(userEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateBankInfo > userEntity : ',
            userEntity
        );
        let result;
        try {
            result = await this.db.updateBankInfo(userEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updateBankInfo > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // DELETE
    async deleteUser(accessToken, userEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > deleteUser > userEntity : ',
            userEntity
        );
        let result;
        try {
            result = await this.db.deleteUser(accessToken, userEntity);
            console.log(
                '응답 > Adapter > outBound > repository > deleteUser > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > deleteUser > error : ',
                error
            );
            throw error;
        }
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
    async updateUserBelongingStatus(relationEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateBelongingStatus > relationEntity: ',
            relationEntity
        );
        try {
            let result = await this.db.updateUserBelongingStatus(
                relationEntity
            );
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
