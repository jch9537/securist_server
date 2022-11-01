const { service } = require('../outbound');
const {
    GetCompleteCertifications,
    GetLinkedAllInfoByCertification,
    GetLinkedTasksInfo,
} = require('../../domain/usecase/settings');

module.exports = class SettingsAdapter {
    constructor() {}

    // 게시 완료된 인증 리스트 조회하기
    async getCompleteCertifications() {
        try {
            let getCertifications = new GetCompleteCertifications(service);
            let result = await getCertifications.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 선택 인증의 모든 연결 정보 가져오기
    async getLinkedAllInfoByCertification(certificationData) {
        try {
            let getLinkedAllInfoByCertification = new GetLinkedAllInfoByCertification(
                service
            );
            let result = await getLinkedAllInfoByCertification.excute(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 선택 인증들의 과제 리스트 가져오기
    async getLinkedTasksInfo(certificationData) {
        try {
            let getTasksByCertifications = new GetLinkedTasksInfo(service);
            let result = await getTasksByCertifications.excute(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
