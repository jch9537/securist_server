const ClientCoEntity = require('../entity/ClientCoEntity');

module.exports = class {
    constructor(Repository) {
        this.Repository = Repository; //DB로 변경
    }
    excute({ businessLicenseNum, clientName, presidentName }) {
        let clientCoEntity = new ClientCoEntity({
            businessLicenseNum,
            clientName,
            presidentName,
        });
        let result = this.Repository.createClientCo(clientCoEntity);
        return result;
    }
};
