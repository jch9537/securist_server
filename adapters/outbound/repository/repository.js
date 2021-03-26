module.exports = class {
    constructor(db) {
        this.db = db;
    }
    createClientUser(clientUserEntity) {
        console.log('Repository: createClientUser!!', clientUserEntity);
    }
    createClientCo(clientCoEntity) {
        console.log('Repository: createClientInc!!', clientCoEntity);
    }
    createConsultantUser(consultantUserEntity) {
        console.log('Repository: createConsultantUser!!', consultantUserEntity);
    }
    createConsultingCo(consultingCoEntity) {
        console.log('Repository: createConsultingInc!!', consultingCoEntity);
    }
};
