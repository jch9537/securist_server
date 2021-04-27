module.exports = class {
    constructor(db) {
        this.db = db;
    }
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

    //get User
    async getClientUserInfo(email) {
        console.log(
            '요청 > Adapter > outBound > repository > getClientUser > email : ',
            email
        );
        let result;
        try {
            result = await this.db.getClientUserInfo(email);
            console.log(
                '응답 > Adapter > outBound > repository > getClientUserInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async getConsultantUserInfo(email) {
        console.log(
            '요청 > Adapter > outBound > repository > getClientUser > email : ',
            email
        );
        let result;
        try {
            result = await this.db.getConsultantUserInfo(email);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultantUserInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
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
    // 기업정보 가져오기
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
    // 사용자 정보 변경 > 공통 : 연락처
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
    async updateUserBankInfo(updateBankInfoEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateUserBankInfo > updateBankInfoEntity : ',
            updateBankInfoEntity
        );
        let result;
        try {
            result = await this.db.updateUserBankInfo(updateBankInfoEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updateUserBankInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async updateCompanyBankInfo(updateBankInfoEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > updateCompanyBankInfo > updateBankInfoEntity : ',
            updateBankInfoEntity
        );
        let result;
        try {
            result = await this.db.updateCompanyBankInfo(updateBankInfoEntity);
            console.log(
                '응답 > Adapter > outBound > repository > updateCompanyBankInfo > result : ',
                result
            );
        } catch (error) {
            throw error;
        } finally {
            return result;
        }
    }
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
};
