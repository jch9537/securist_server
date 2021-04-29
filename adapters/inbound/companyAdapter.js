const { Auth, Repository, SendMail } = require('../outbound');
const {
    GetCompanyInfo,
    GetCompanyList,
    GetCompanyBelongedUsersInfo,
    // UpdateRegistrationStatus,
} = require('../../domain/usecase/company');

module.exports = {
    // 기업 리스트 가져오기 : 기업(클/컨) 공통
    async getCompanyList(userData) {
        try {
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
    async getCompanyInfo(userData, companyId) {
        try {
            let getCompanyInfo = new GetCompanyInfo(Repository);
            let result = await getCompanyInfo.excute(userData, companyId);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - err : ',
                err
            );
            throw err;
        }
    },
    // 기업 내 소속 사용자 정보 가져오기 : 기업(클/컨) 공통
    async getCompanyBelongedUsersInfo(userData, companyId) {
        try {
            let getCompanyBelongedUsersInfo = new GetCompanyBelongedUsersInfo(
                Repository
            );
            let result = await getCompanyBelongedUsersInfo.excute(
                userData,
                companyId
            );
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - err : ',
                err
            );
            throw err;
        }
    },
    // async updateRegistrationStatus(userData, regiData) {
    //     try {
    //         let updateRegistrationStatus = new UpdateRegistrationStatus(
    //             Repository
    //         );
    //         let result = await updateRegistrationStatus.excute(
    //             userData,
    //             regiData
    //         );
    //         console.log(
    //             '응답 > adapters > inbound > companyAdaptor.js > updateRegistrationStatus - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (err) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > companyAdaptor.js > updateRegistrationStatus - err : ',
    //             err
    //         );
    //         throw err;
    //     }
    // },

    // updateCompany(req, res) {
    //     res.send('updateCompany!!');
    // },
    // deleteCompany(req, res) {
    //     res.send('deleteCompany!!');
    // },
};
