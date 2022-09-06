const { TempProfilesEntity, TempUploadFilesEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class GetTempProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
        try {
            let {
                tempProfilesRepository,
                tempAbilityCertificationsRepository,
                tempAbilityTasksRepository,
                tempAbilityIndustriesRepository,
                tempEtcCertificationsRepository,
                tempAcademicBackgroundRepository,
                tempCareerRepository,
                tempLicenseRepository,
                tempProjectHistoryRepository,
                tempUploadFilesRepository,
            } = this.repository;
            console.log(' 유스케이스 : ', userData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 엔터티 생성
            let tempProfilesEntity = new TempProfilesEntity(userData);
            // 임시 저장 프로필 정보 가져오기
            const tempProfileInfo = await tempProfilesRepository.getTempProfile(
                tempProfilesEntity
            );

            // 임시 정보 없는 경우 > 응답 처리
            if (!tempProfileInfo) {
                return { message: 'Not exist' };
            }
            const tempProfileId = tempProfileInfo.tempProfileId;
            // 인증 정보 id 리스트 가져오기
            tempProfileInfo.abilityCertificationIds = await tempAbilityCertificationsRepository.getTempAbilityCertifications(
                { tempProfileId }
            );
            // 과제 정보 id 리스트 가져오기
            tempProfileInfo.abilityTaskIds = await tempAbilityTasksRepository.getTempAbilityTasks(
                { tempProfileId }
            );
            // 업종 정보 id 리스트 가져오기
            tempProfileInfo.abilityIndustryIds = await tempAbilityIndustriesRepository.getTempAbilityIndustries(
                { tempProfileId }
            );
            // 기타 정보 가져오기
            tempProfileInfo.abilityEtc = await tempEtcCertificationsRepository.getTempEtcCertifications(
                { tempProfileId }
            );
            // 최종 학력 정보 가져오기
            tempProfileInfo.academicBackground = await tempAcademicBackgroundRepository.getTempAcademicBackground(
                { tempProfileId }
            );
            // 경력 정보 리스트 가져오기
            tempProfileInfo.career = await tempCareerRepository.getTempCareer({
                tempProfileId,
            });
            // 자격증 정보 리스트 가져오기
            tempProfileInfo.license = await tempLicenseRepository.getTempLicense(
                {
                    tempProfileId,
                }
            );
            // 수행 이력 정보 리스트 가져오기
            tempProfileInfo.projectHistory = await tempProjectHistoryRepository.getTempProjectHistory(
                {
                    tempProfileId,
                }
            );
            // 업로드 파일 리스트 가져오기
            tempProfileInfo.uploadFiles = await tempUploadFilesRepository.getTempUploadFiles(
                {
                    tempProfileId,
                }
            );

            return tempProfileInfo;
        } catch (error) {
            throw error;
        }
    }
};
