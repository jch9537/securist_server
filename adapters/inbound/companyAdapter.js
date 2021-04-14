const { Auth, Repository, SendMail } = require('../outbound');

module.exports = {
    // createCompany - signUp에서 처리함
    getCompanyInfo(req, res) {
        res.send('getCompany!!');
    },
    // updateCompany(req, res) {
    //     res.send('updateCompany!!');
    // },
    // deleteCompany(req, res) {
    //     res.send('deleteCompany!!');
    // },
};
