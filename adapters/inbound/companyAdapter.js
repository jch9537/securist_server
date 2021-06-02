const { repository } = require('../outbound');
const {
    GetCompanyInfo,
    GetCompanyList,
    GetCompanyBelongedUsersInfo,
} = require('../../domain/usecase/company');

module.exports = {
    // 기업 리스트 가져오기 : 기업(클/컨) 공통
    async getCompanyList(userData) {
        try {
            let getCompanyList = new GetCompanyList(repository);
            let result = await getCompanyList.excute(userData);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyList - result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyList - error : ',
                error
            );
            throw error;
        }
    },
    async getCompanyInfo(userData, companyData) {
        try {
            let getCompanyInfo = new GetCompanyInfo(repository);
            let result = await getCompanyInfo.excute(userData, companyData);
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - error : ',
                error
            );
            throw error;
        }
    },
    // 기업 내 소속 사용자 정보 가져오기 : 기업(클/컨) 공통
    async getCompanyBelongedUsersInfo(userData, companyData) {
        try {
            let getCompanyBelongedUsersInfo = new GetCompanyBelongedUsersInfo(
                repository
            );
            let result = await getCompanyBelongedUsersInfo.excute(
                userData,
                companyData
            );
            console.log(
                '응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - result : ',
                result
            );
            return result;
        } catch (error) {
            console.log(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - error : ',
                error
            );
            throw error;
        }
    },
};
