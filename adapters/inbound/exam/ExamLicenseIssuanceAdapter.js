const { service } = require('../../outbound');
const {
    CreateLicenseIssuance,
    GetLicenseIssuanceListByReceptionId,
    GetLicenseIssuanceByUser,
    UpdateLicenseIssuanceByUser,
    CancelLicenseIssuanceByUser,
} = require('../../../domain/usecase/exam/LicenseIssuance');

module.exports = class ExamLicenseIssuanceAdapter {
    constructor(userService, projectService) {
        this.userService = userService;
        this.projectService = projectService;
    }
    // 자격증 신청 정보 생성 : 사용자
    async createLicenseIssuance(issuanceData) {
        try {
            console.log({ issuanceData });
            let createLicenseIssuance = new CreateLicenseIssuance(service);
            let result = await createLicenseIssuance.excute(issuanceData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 자격증 신청 리스트 가져오기 : 사용자
    async getLicenseIssuanceListByReceptionId(issuanceData) {
        try {
            console.log('adapto', issuanceData);
            let getLicenseIssuanceListByReceptionId = new GetLicenseIssuanceListByReceptionId(
                service
            );
            let result = await getLicenseIssuanceListByReceptionId.excute(
                issuanceData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 개별 자격증 신청 정보 가져오기 : 사용자
    async getLicenseIssuanceByUser(issuanceData) {
        try {
            let getLicenseIssuanceByUser = new GetLicenseIssuanceByUser(
                service
            );
            let result = await getLicenseIssuanceByUser.excute(issuanceData);
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 자격증 신청 정보 수정하기 : 사용자
    async updateLicenseIssuanceByUser(issuanceData) {
        try {
            let updateLicenseIssuanceByUser = new UpdateLicenseIssuanceByUser(
                service
            );
            let result = await updateLicenseIssuanceByUser.excute(issuanceData);

            return result;
        } catch (error) {
            throw error;
        }
    }

    // 자격증 신청 취소하기 : 사용자
    async cancelLicenseIssuanceByUser(issuanceData) {
        // console.log(
        //     '요청 > adapters > inbound > examAdapter > cancelLicenseIssuanceByUser - parameter : '
        // );
        try {
            let cancelLicenseIssuanceByUser = new CancelLicenseIssuanceByUser(
                service
            );
            let result = await cancelLicenseIssuanceByUser.excute(issuanceData);
            // console.log(
            //     '응답 > adapters > inbound > examAdapter > cancelLicenseIssuanceByUser - result : ',
            //     result
            // );

            return result;
        } catch (error) {
            // console.log(
            //     '에러 응답 > adapters > inbound > examAdapter > cancelLicenseIssuanceByUser - error : ',
            //     error
            // );
            throw error;
        }
    }
};
