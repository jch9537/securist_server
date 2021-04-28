module.exports = class {
    constructor(db) {
        this.db = db;
    }
    // 인증--------------------------------------------------------------------
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
    // signUp에서 모두 처리함
    // async createUser(userEntity) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > createUser > userEntity : ',
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
    //         '요청 > Adapter > outBound > repository > createCompany > companyEntity : ',
    //         companyEntity
    //     );
    //     let result;
    //     try {
    //         result = await this.db.createCompany(companyEntity);
    //         // console.log(
    //         //     '응답 > Adapter > outBound > repository > createCompany > result : ',
    //         //     result
    //         // );
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }
    // async createCompanyAndUserRelation(companyAndUserRelationData) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > createCompany > companyAndUserRelationData : ',
    //         companyAndUserRelationData
    //     );
    //     let result;
    //     try {
    //         result = await this.db.createCompanyAndUserRelation(
    //             companyAndUserRelationData
    //         );
    //         // console.log(
    //         //     '응답 > Adapter > outBound > repository > createCompany > result : ',
    //         //     result
    //         // );
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }

    // 사용자--------------------------------------------------------------------
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
    // async getClientUserInfo(email) {
    //     console.log(
    //         '요청 > Adapter > outBound > repository > getClientUser > email : ',
    //         email
    //     );
    //     let result;
    //     try {
    //         result = await this.db.getClientUserInfo(email);
    //         console.log(
    //             '응답 > Adapter > outBound > repository > getClientUserInfo > result : ',
    //             result
    //         );
    //     } catch (error) {
    //         throw error;
    //     }
    //     return result;
    // }
    async getUserBelongingInfo(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getUserBelongingInfo > userData : ',
            userData
        );
        let result;
        try {
            result = await this.db.getUserBelongingInfo(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getUserBelongingInfo > result : ',
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
    async getCompanyUserCount(userData, companyId) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyUserCount > userData, companyId : ',
            companyId,
            userData
        );
        let result;
        try {
            result = await this.db.getCompanyUserCount(userData, companyId);
            console.log(
                '응답 > Adapter > outBound > repository > getCompanyUserCount > result : ',
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
    async deleteUserAndCompanyRelation(releaseData) {
        console.log(
            '요청 > Adapter > outBound > repository > deleteUserAndCompanyRelation > releaseData: ',
            releaseData
        );
        let result;
        try {
            result = await this.db.deleteUserAndCompanyRelation(releaseData);
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
