const { Auth, Repository, SendMail } = require('../outbound');
const {
    GetCompanyList,
    GetCompanyUserCount,
} = require('../../domain/usecase/company');
const authAdapter = require('./authAdapter');

module.exports = {
    // 기업 리스트 가져오기 : 기업(클/컨) 공통
    async getCompanyList(token) {
        try {
            let userData = await authAdapter.getUserByIdToken(token);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getUserByIdToken - userData : ',
                userData
            );
            let getCompanyList = new GetCompanyList(Repository);
            let result = await getCompanyList.excute(userData);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyList - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyList - err : ',
                err
            );
            throw err;
        }
    },
    // 기업 내 소속 사용자 수 가져오기 : 기업(클/컨) 공통
    async getCompanyUserCount(token, companyId) {
        try {
            let userData = await authAdapter.getUserByIdToken(token);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getUserByIdToken - userData : ',
                userData
            );
            let getCompanyUserCount = new GetCompanyUserCount(Repository);
            let result = await getCompanyUserCount.excute(userData, companyId);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyUserCount - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyUserCount - err : ',
                err
            );
            throw err;
        }
    },

    // updateCompany(req, res) {
    //     res.send('updateCompany!!');
    // },
    // deleteCompany(req, res) {
    //     res.send('deleteCompany!!');
    // },
};
