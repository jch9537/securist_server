const { Auth, Repository, SendMail } = require('../outbound');
const { CreateClientCo } = require('../../domain/company/useCases');

module.exports = {
    createCompany(companyData) {
        console.log(
            '요청 > adapters > inbound > companyAdaptor.js > createCompany - companyData : ',
            companyData
        );
        try {
            let createClientCo = new CreateClientCo(Repository);
            let result = createClientCo.excute(companyData);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > createCompany - result : ',
                result
            );
            return result;
        } catch (err) {
            return err;
        }
    },
    // getCompany(req, res) {
    //     res.send('getCompany!!');
    // },
    // updateCompany(req, res) {
    //     res.send('updateCompany!!');
    // },
    // deleteCompany(req, res) {
    //     res.send('deleteCompany!!');
    // },
};
