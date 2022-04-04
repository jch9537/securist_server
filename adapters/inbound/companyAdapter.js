const { repository } = require('../outbound');
const userAdapter = require('./UserAdapter');
const {
    GetCompanyInfo,
    GetCompanyList,
    GetCompanyBelongedUsersInfo,
    UpdateRegistrationStatus,
} = require('../../domain/usecase/company');

module.exports = class CompanyAdapter {
    constructor(projectService, adminService) {
        this.projectService = projectService;
        this.adminService = adminService;
    }
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
            console.error(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyList - error : ',
                error
            );
            throw error;
        }
    }
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
            console.error(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyInfo - error : ',
                error
            );
            throw error;
        }
    }
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
            console.error(
                '에러 응답 > adapters > inbound > companyAdaptor.js > getCompanyBelongedUsersInfo - error : ',
                error
            );
            throw error;
        }
    }
    // 기업-사용자 소속상태 변경 처리 : 기업, 사용자 공통
    async updateRegistrationStatus(userData, updateData) {
        let result, updateStatusData, companyIdColumn;
        console.log(
            '요청 > adapters > inbound > userAdaptor > updateRegistrationStatus - userId : ',
            userData,
            updateData
        );
        try {
            // // userData.userType = 1; //테스트용
            // if (userData.userType === 1) {
            //     updateStatusData = {
            //         userType: userData.userType,
            //         companyId: updateData.companyId,
            //         email: userData.email,
            //         // email: 'mg.sun@aegisecu.com', //테스트용
            //         belongingType: updateData.belongingType,
            //     };
            // } else {
            if (userData.userType === 3) {
                companyIdColumn = 'client_company_id';
            } else if (userData.userType === 2) {
                companyIdColumn = 'consulting_company_id';
            }

            let companyInfo = await userAdapter.getUserBelongingCompanyInfo(
                userData
            );
            let companyId = companyInfo[companyIdColumn];

            updateStatusData = {
                userType: userData.userType,
                companyId: companyId,
                email: updateData.userId,
                belongingType: updateData.belongingType,
            };
            // }

            let updateRegistrationStatus = new UpdateRegistrationStatus(
                repository
            );
            result = await updateRegistrationStatus.excute(
                userData,
                updateStatusData
            );
            console.log(
                '응답 > adapters > inbound > userAdaptor > updateRegistrationStatus- result : ',
                result
            );
            return result;
        } catch (error) {
            console.error(
                '에러 > adapters > inbound > userAdaptor > updateRegistrationStatus- erroror : ',
                error
            );
            throw error;
        }
    }
};
