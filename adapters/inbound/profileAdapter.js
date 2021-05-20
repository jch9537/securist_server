const { Auth, Repository, SendMail } = require('../outbound');
const {
    CreateConsultantProfileTemp,
    CreateConsultingCompanyProfileTemp,
    GetConsultantProfileTemp,
    UpdateProfileTemp,
    DeleteProfileTemp,
} = require('../../domain/usecase/profile');

module.exports = {
    // 사용자 - 프로필 임시정보 생성 : 임시저장
    async createConsultantProfileTemp(userData, tempData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > createConsultantProfileTemp - result : ',
            userData,
            tempData,
            uploadData
        );
        try {
            let createConsultantProfileTemp = new CreateConsultantProfileTemp(
                Repository
            );
            let result = await createConsultantProfileTemp.excute(
                userData,
                tempData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > createConsultantProfileTemp - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultantProfileTemp - err : ',
                err
            );
            throw err;
        }
    },
    // 기업 - 프로필 임시정보 생성 : 임시저장
    async createConsultingCompanyProfileTemp(userData, tempData, uploadData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - result : ',
            userData,
            tempData,
            uploadData
        );
        try {
            let createConsultingCompanyProfileTemp = new CreateConsultingCompanyProfileTemp(
                Repository
            );
            let result = await createConsultingCompanyProfileTemp.excute(
                userData,
                tempData,
                uploadData
            );
            console.log(
                '응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > createConsultingCompanyProfileTemp - err : ',
                err
            );
            throw err;
        }
    },

    async getConsultantProfileTemp(userData) {
        console.log(
            '요청 > adapters > inbound > profileAdapter > getConsultantProfileTemp - result : ',
            userData
        );
        try {
            let getConsultantProfileTemp = new GetConsultantProfileTemp(
                Repository
            );
            let result = await getConsultantProfileTemp.excute(userData);
            console.log(
                '응답 > adapters > inbound > profileAdapter > getConsultantProfileTemp - result : ',
                result
            );
            return result;
        } catch (err) {
            console.log(
                '에러 응답 > adapters > inbound > profileAdapter > getConsultantProfileTemp - err : ',
                err
            );
            throw err;
        }
    },
    // // 기업 리스트 가져오기 : 기업(클/컨) 공통
    // async getCompanyList(userData) {
    //     try {
    //         let getCompanyList = new GetCompanyList(Repository);
    //         let result = await getCompanyList.excute(userData);
    //         console.log(
    //             '응답 > adapters > inbound > companyAdaptor.js > getCompanyList - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (err) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyList - err : ',
    //             err
    //         );
    //         throw err;
    //     }
    // },
    // async getCompanyInfo(userData, companyId) {
    //     try {
    //         let getCompanyInfo = new GetCompanyInfo(Repository);
    //         let result = await getCompanyInfo.excute(userData, companyId);
    //         console.log(
    //             '응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (err) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - err : ',
    //             err
    //         );
    //         throw err;
    //     }
    // },
    // // 기업 내 소속 사용자 정보 가져오기 : 기업(클/컨) 공통
    // async getCompanyBelongedUsersInfo(userData, companyId) {
    //     try {
    //         let getCompanyBelongedUsersInfo = new GetCompanyBelongedUsersInfo(
    //             Repository
    //         );
    //         let result = await getCompanyBelongedUsersInfo.excute(
    //             userData,
    //             companyId
    //         );
    //         console.log(
    //             '응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - result : ',
    //             result
    //         );
    //         return result;
    //     } catch (err) {
    //         console.log(
    //             '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - err : ',
    //             err
    //         );
    //         throw err;
    //     }
    // },
};
