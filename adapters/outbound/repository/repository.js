module.exports = class {
    constructor(db) {
        this.db = db;
    }
    async signUp(signUpEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - signUp > signUpEntity : ',
            signUpEntity
        );
        let result;
        try {
            result = await this.db.signUp(signUpEntity);
            console.log(
                '응답 > Adapter > outBound > repository > repository.js - signUp > result : ',
                result
            );
        } catch (error) {
            console.log(
                '에러 응답 > Adapter > outBound > repository > repository.js - signUp > result : ',
                error
            );
            throw error;
        }
        return result;
    }
    // signUp에서 모두 처리함
    // async createUser(userEntity) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > repository.js - createUser > userEntity : ',
    //         userEntity
    //     );
    //     let result;
    //     try {
    //         result = await this.db.createUser(userEntity);
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }
    // async createCompany(companyEntity) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > repository.js - createCompany > companyEntity : ',
    //         companyEntity
    //     );
    //     let result;
    //     try {
    //         result = await this.db.createCompany(companyEntity);
    //         // console.log(
    //         //     '응답 > Adapter > outBound > repository > repository.js - createCompany > result : ',
    //         //     result
    //         // );
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }
    // async createCompanyAndUserRelation(companyAndUserRelationData) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > repository.js - createCompany > companyAndUserRelationData : ',
    //         companyAndUserRelationData
    //     );
    //     let result;
    //     try {
    //         result = await this.db.createCompanyAndUserRelation(
    //             companyAndUserRelationData
    //         );
    //         // console.log(
    //         //     '응답 > Adapter > outBound > repository > repository.js - createCompany > result : ',
    //         //     result
    //         // );
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }

    //get User
    async getClientUserInfo(email) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - getClientUser > email : ',
            email
        );
        let result;
        try {
            result = await this.db.getClientUserInfo(email);
            console.log(
                '응답 > Adapter > outBound > repository > repository.js - getClientUserInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async getConsultantUserInfo(email) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - getClientUser > email : ',
            email
        );
        let result;
        try {
            result = await this.db.getConsultantUserInfo(email);
            console.log(
                '응답 > Adapter > outBound > repository > repository.js - getConsultantUserInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    // 사용자 정보 변경 - 공통 : 연락처
    async updatePhoneNum(updatePhoneNumEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - updatePhoneNum > updatePhoneNumEntity : ',
            updatePhoneNumEntity
        );
        let result;
        try {
            result = await this.db.updatePhoneNum(updatePhoneNumEntity);
            console.log(
                '응답 > Adapter > outBound > repository > repository.js - updatePhoneNum > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async updateUserBankInfo(updateBankInfoEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - updateUserBankInfo > updateBankInfoEntity : ',
            updateBankInfoEntity
        );
        let result;
        try {
            result = await this.db.updateUserBankInfo(updateBankInfoEntity);
            console.log(
                '응답 > Adapter > outBound > repository > repository.js - updateUserBankInfo > result : ',
                result
            );
            return result;
        } catch (error) {
            throw error;
        }
        // finally {
        //     return result;
        // }
    }
    async updateCompanyBankInfo(updateBankInfoEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - updateCompanyBankInfo > updateBankInfoEntity : ',
            updateBankInfoEntity
        );
        let result;
        try {
            result = await this.db.updateCompanyBankInfo(updateBankInfoEntity);
            console.log(
                '응답 > Adapter > outBound > repository > repository.js - updateCompanyBankInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        } finally {
            return result;
        }
    }
    // async updateConsultantPhoneNum(updatePhoneNumEntity) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > repository.js - updateClientUser > updatePhoneNumEntity : ',
    //         updatePhoneNumEntity
    //     );
    //     let result;
    //     try {
    //         result = await this.db.updateConsultantUserInfo(
    //             updatePhoneNumEntity
    //         );
    //         console.log(
    //             '응답 > Adapter > outBound > repository > repository.js - updateConsultantUserInfo > result : ',
    //             result
    //         );
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }
};
