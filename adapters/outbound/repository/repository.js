module.exports = class {
    constructor(db) {
        this.db = db;
    }
    async createClientUser(clientUserEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - createClientUser > clientUserEntity : ',
            clientUserEntity
        );
        let result;
        try {
            result = await this.db.createClientUser(clientUserEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
    async createConsultantUser(consultantUserEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - createConsultantUser > consultantUserEntity : ',
            consultantUserEntity
        );
        let result;
        try {
            result = await this.db.createConsultantUser(consultantUserEntity);
        } catch (error) {
            throw error;
        }
        return result;
    }
    async createClientCompany(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - createClientCompany > companyEntity : ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.createClientCompany(companyEntity);
            // console.log(
            //     '응답 > Adapter > outBound > repository > repository.js - createClientCompany > result : ',
            //     result
            // );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async createConsultingCompany(companyEntity) {
        console.log(
            '요청 > Adapter > outBound > repository > repository.js - createConsultingCompany > companyEntity : ',
            companyEntity
        );
        let result;
        try {
            result = await this.db.createConsultingCompany(companyEntity);
            // console.log(
            //     '응답 > Adapter > outBound > repository > repository.js - createConsultingCompany > result : ',
            //     result
            // );
        } catch (error) {
            throw error;
        }
        return result;
    }
    async createClientUserAndCompany() {}
    async createConsultingUserAndComapany() {}
};
