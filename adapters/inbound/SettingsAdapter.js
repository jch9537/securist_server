const { service } = require('../outbound');
const {
    GetCertifications,
    GetCertification,
    CreateCertification,
    DeleteCertification,
    UpdateCertification,
} = require('../../../domain/usecase/settings/certifications');

module.exports = class SettingsAdapter {
    constructor() {}

    // 인증 리스트 가져오기
    async getCertifications() {
        try {
            let getCertifications = new GetCertifications(service);
            let result = await getCertifications.excute();
            return result;
        } catch (error) {
            throw error;
        }
    }

    // 인증의 모든 연결 정보 가져오기
    async getCertificationsAllInfo(certificationData) {
        try {
            let getCertificationsAllInfo = new GetCertificationsAllInfo(
                service
            );
            let result = await getCertificationsAllInfo.excute(
                certificationData
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
};
