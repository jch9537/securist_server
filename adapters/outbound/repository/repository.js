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
    async updateBankInfo(updateBankInfoEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateBankInfo > updateBankInfoEntity : ',
            updateBankInfoEntity
        );
        let result;
        try {
            result = await this.db.updateBankInfo(updateBankInfoEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updateBankInfo > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateJoinStatus(updateJoinStatusEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateJoinStatus > updateJoinStatusEntity : ',
            updateJoinStatusEntity
        );
        let result;
        try {
            result = await this.db.updateJoinStatus(updateJoinStatusEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updateJoinStatus > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async updateRegistrationStatus(userData, regiData) {
        console.log(
            '요청 > Adapter > outBound > repository > updateRegistrationStatus > userData, regiData : ',
            userData,
            regiData
        );
        let result;
        try {
            result = await this.db.updateRegistrationStatus(userData, regiData);
            console.log(
                '응답 > Adapter > outBound > repository > updateRegistrationStatus > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // DELETE
    async deleteUser(accessToken, deleteUserEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > deleteUser > deleteUserEntity : ',
            deleteUserEntity
        );
        let result;
        try {
            result = await this.db.deleteUser(accessToken, deleteUserEntity);
            console.log(
                '응답 > Adapter > outBound > repository > deleteUser > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 기업--------------------------------------------------------------------
    // GET
    async getCompanyInfo(userData, companyId) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyInfo > userData : ',
            companyId
        );
        let result;
        try {
            result = await this.db.getCompanyInfo(userData, companyId);
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async getCompanyList(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyList > 요청없음 : '
        );
        let result;
        try {
            result = await this.db.getCompanyList(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyList > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    async getCompanyBelongedUsersInfo(userData, companyId) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyBelongedUsersInfo > userData, companyId : ',
            companyId,
            userData
        );
        let result;
        try {
            result = await this.db.getCompanyBelongedUsersInfo(
                userData,
                companyId
            );
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyBelongedUsersInfo > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
    // 사용자-기업 관계--------------------------------------------------------------------
    // CREATE
    async createUserAndCompanyRelation(joinData) {
        console.log(
            '요청 > Adapter > outBound > repository > createUserAndCompanyRelation > joinData: ',
            joinData
        );
        let result;
        try {
            result = await this.db.createUserAndCompanyRelation(joinData);
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
