const { service } = require('../outbound');
const {
    GetCompleteCertifications,
    GetCertificationConnectedInfo,
    GetTasksByCertifications,
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
    async getCertificationConnectedInfo(certificationData) {
        try {
            let getCertificationConnectedInfo = new GetCertificationConnectedInfo(
                service
            );
            let result = await getCertificationConnectedInfo.excute(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 선택 인증들의 과제 리스트 가져오기
    async getTasksByCertifications(certificationData) {
        try {
            let getTasksByCertifications = new GetTasksByCertifications(
                service
            );
            let result = await getTasksByCertifications.excute(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
