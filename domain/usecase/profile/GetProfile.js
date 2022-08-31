const { ProfilesEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class GetProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(profileData) {
        try {
            let {
                profilesRepository,
                profileAbilityCertificationsRepository,
                profileAbilityTasksRepository,
                profileAbilityIndustriesRepository,
                profileAbilityEtcRepository,
                profileAcademicBackgroundRepository,
                profileCareerRepository,
                profileLicenseRepository,
                profileProjectHistoryRepository,
                profileUploadFilesRepository,
            } = this.repository;
            console.log(' 유스케이스 : ', profileData);

            // 엔터티 생성
            let profilesEntity = new ProfilesEntity(profileData);
            // 최신 프로필 정보 가져오기
            const profileInfo = await profilesRepository.getProfile(
                profilesEntity
            );
            console.log('최신 프로필 정보 : ', profileInfo);

            // 프로필 정보 없는 경우 > 응답 처리
            if (!profileInfo) {
                return { message: 'Not exist' };
            }
            const profileId = profileInfo.profileId;
            // 인증 정보 id 리스트 가져오기
            profileInfo.abilityCertificationIds = await profileAbilityCertificationsRepository.getProfileAbilityCertifications(
                { profileId }
            );
            // 과제 정보 id 리스트 가져오기
            profileInfo.abilityTaskIds = await profileAbilityTasksRepository.getProfileAbilityTasks(
                { profileId }
            );
            // 업종 정보 id 리스트 가져오기
            profileInfo.abilityIndustryIds = await profileAbilityIndustriesRepository.getProfileAbilityIndustries(
                { profileId }
            );
            // 기타 정보 가져오기
            profileInfo.abilityEtc = await profileAbilityEtcRepository.getProfileAbilityEtc(
                { profileId }
            );
            // 최종 학력 정보 가져오기
            profileInfo.academicBackground = await profileAcademicBackgroundRepository.getProfileAcademicBackground(
                { profileId }
            );
            // 경력 정보 리스트 가져오기
            profileInfo.career = await profileCareerRepository.getProfileCareer(
                {
                    profileId,
                }
            );
            // 자격증 정보 리스트 가져오기
            profileInfo.license = await profileLicenseRepository.getProfileLicense(
                {
                    profileId,
                }
            );
            // 수행 이력 정보 리스트 가져오기
            profileInfo.projectHistory = await profileProjectHistoryRepository.getProfileProjectHistory(
                {
                    profileId,
                }
            );
            // 업로드 파일 리스트 가져오기
            profileInfo.uploadFiles = await profileUploadFilesRepository.getProfileUploadFiles(
                {
                    profileId,
                }
            );

            return profileInfo;
        } catch (error) {
            throw error;
        }
    }
};
