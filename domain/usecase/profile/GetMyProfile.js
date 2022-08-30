const { ProfilesEntity } = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class GetMyProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData) {
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
            console.log(' 유스케이스 : ', userData);
            // // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 엔터티 생성
            let profilesEntity = new ProfilesEntity(userData);
            // 최신 프로필 정보 가져오기
            const myLatestProfileInfo = await profilesRepository.getMyProfile(
                profilesEntity
            );
            console.log('최신 프로필 정보 : ', myLatestProfileInfo);

            // 프로필 정보 없는 경우 > 응답 처리
            if (!myLatestProfileInfo) {
                return { message: 'Not exist' };
            }
            const profileId = myLatestProfileInfo.profileId;
            // 인증 정보 id 리스트 가져오기
            myLatestProfileInfo.abilityCertificationIds = await profileAbilityCertificationsRepository.getProfileAbilityCertifications(
                { profileId }
            );
            // 과제 정보 id 리스트 가져오기
            myLatestProfileInfo.abilityTaskIds = await profileAbilityTasksRepository.getProfileAbilityTasks(
                { profileId }
            );
            // 업종 정보 id 리스트 가져오기
            myLatestProfileInfo.abilityIndustryIds = await profileAbilityIndustriesRepository.getProfileAbilityIndustries(
                { profileId }
            );
            // 기타 정보 가져오기
            myLatestProfileInfo.abilityEtc = await profileAbilityEtcRepository.getProfileAbilityEtc(
                { profileId }
            );
            // 최종 학력 정보 가져오기
            myLatestProfileInfo.academicBackground = await profileAcademicBackgroundRepository.getProfileAcademicBackground(
                { profileId }
            );
            // 경력 정보 리스트 가져오기
            myLatestProfileInfo.career = await profileCareerRepository.getProfileCareer(
                {
                    profileId,
                }
            );
            // 자격증 정보 리스트 가져오기
            myLatestProfileInfo.license = await profileLicenseRepository.getProfileLicense(
                {
                    profileId,
                }
            );
            // 수행 이력 정보 리스트 가져오기
            myLatestProfileInfo.projectHistory = await profileProjectHistoryRepository.getProfileProjectHistory(
                {
                    profileId,
                }
            );
            // 업로드 파일 리스트 가져오기
            myLatestProfileInfo.uploadFiles = await profileUploadFilesRepository.getProfileUploadFiles(
                {
                    profileId,
                }
            );

            return myLatestProfileInfo;
        } catch (error) {
            throw error;
        }
    }
};
