/* 
**파라미터 명 
1. OOOToken : 토큰 
2. OOOEntity: entity를 거친 유효한 client input Data  
3. OOOData : 토큰을 복호화해 가져온 신뢰할 수 있는 사용자 Data (entity 거치지 않음)
*/
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

    // 기업--------------------------------------------------------------------
    // GET
    async getCompanyInfo(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyInfo > userData : ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.getCompanyInfo(companyEntity);
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
    async getCompanyBelongedUsersInfo(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > getCompanyBelongedUsersInfo > companyEntity : ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.getCompanyBelongedUsersInfo(companyEntity);
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

    // 프로필 --------------------------------------------------------------------
    // CREATE
    // 사용자
    async createConsultantProfileTemp(createProfileTempEntity, uploadData) {
        console.log(
            '요청 > Adapter > outBound > repository > createConsultantProfileTemp > createProfileTempEntity: ',
            createProfileTempEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.createConsultantProfileTemp(
                createProfileTempEntity,
                uploadData
            );
            console.log(
                '응답 > Adapter > outBound > repository > createConsultantProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > createConsultantProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    //기업
    async createConsultingCompanyProfileTemp(
        createProfileTempEntity,
        uploadData
    ) {
        console.log(
            '요청 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > deleteData: ',
            createProfileTempEntity,
            uploadData
        );
        let result;
        try {
            result = await this.db.createConsultingCompanyProfileTemp(
                createProfileTempEntity,
                uploadData
            );
            console.log(
                '응답 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > createConsultingCompanyProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // GET
    async getConsultantProfileTemp(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getConsultantProfileTemp > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.getConsultantProfileTemp(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultantProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > getConsultantProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    async getConsultingCompanyProfileTemp(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.getConsultingCompanyProfileTemp(userData);
            console.log(
                '응답 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 > Adapter > outBound > repository > getConsultingCompanyProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // UPDATE
    async updateProfileTemp(deleteData) {
        console.log(
            '요청 > Adapter > outBound > repository > updateProfileTemp > deleteData: ',
            deleteData
        );
        let result;
        try {
            result = await this.db.updateProfileTemp(deleteData);
            console.log(
                '응답 > Adapter > outBound > repository > updateProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > updateProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
    // DELETE
    async deleteProfileTemp(userData) {
        console.log(
            '요청 > Adapter > outBound > repository > deleteProfileTemp > userData: ',
            userData
        );
        let result;
        try {
            result = await this.db.deleteProfileTemp(userData);
            console.log(
                '응답 > Adapter > outBound > repository > deleteProfileTemp > result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '응답 > Adapter > outBound > repository > deleteProfileTemp > result : ',
                error
            );
            throw error;
        }
    }
};
