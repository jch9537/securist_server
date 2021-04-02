module.exports = class {
    constructor(db) {
        this.db = db;
    }
    createClientUser(clientUserEntity) {
        console.log('Repository: createClientUser!!', clientUserEntity);
    }
    createClientCompany(companyEntity) {
        console.log('Repository: createClientCompany!!', companyEntity);
    }
    createConsultantUser(consultantUserEntity) {
        console.log('Repository: createConsultantUser!!', consultantUserEntity);
    }
    createConsultingCompany(companyEntity) {
        console.log('Repository: createConsultingCompany!!', companyEntity);
    }
    createShareUserAndClientCompany() {}
    createShareUserAndConsultingComapany() {}
};
