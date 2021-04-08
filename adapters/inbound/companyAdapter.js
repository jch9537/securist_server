const { Auth, Repository, SendMail } = require('../outbound');
const {
    CreateClientCompany,
    CreateConsultingCompany,
} = require('../../domain/company/useCases');

module.exports = {
    createConsultingCompany(companyEntity) {
        console.log(
            '요청 > adapters > inbound > companyAdaptor.js > createConsultingCompany - companyEntity : ',
            companyEntity
        );
        try {
            let result = CreateConsultingCompany.excute(companyEntity);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > createConsultingCompany - result : ',
                result
            );
            return result;
        } catch (err) {
            throw err;
        }
    },
    createClientCompany(companyEntity) {
        console.log(
            '요청 > adapters > inbound > companyAdaptor.js > createClientCompany - companyEntity : ',
            companyEntity
        );
        try {
            let createClientCompany = new CreateClientCompany()
            let result = CreateClientCompany.excute(companyEntity);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > createClientCompany - result : ',
                result
            );
            return result;
        } catch (err) {
            throw err;
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
