const {
    ConsultantUsersEntity,
    ProfilesEntity,
    // ProfileAbilityCertificationsEntity,
    // ProfileAbilityTasksEntity,
    // ProfileAbilityIndustriesEntity,
    ProfileAbilityEtcEntity,
    ProfileAcademicBackgroundEntity,
    ProfileCareerEntity,
    ProfileLicenseEntity,
    ProfileProjectHistoryEntity,
    ProfileUploadFilesEntity,
} = require('../../entities');
const { UserTypeException } = require('../../exceptions');
module.exports = class UpdateProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(profileData, uploadData) {
        try {
            let {
                profileUploadFilesRepository,
                profilesRepository,
            } = this.repository;

            // console.log('프로필 데이터 ', profileData);
            // 기존 프로필 정보 가져오기
            let profilesEntity = new ProfilesEntity(profileData);
            let preProfileInfo = await profilesRepository.getProfile(
                profilesEntity
            );
            // console.log('이전 프로필 정보', preProfileInfo);
            // 기존 업로드 파일 정보리스트  가져오기
            const profileUploadFilesEntity = new ProfileUploadFilesEntity(
                profileData
            );
            const profileUploadFilesInfo = await profileUploadFilesRepository.getProfileUploadFiles(
                profileUploadFilesEntity
            );
            // console.log('임시저장한 파일들 정보 ', profileUploadFilesInfo);
            // 새로운 업로드 파일과 병합
            uploadData = uploadData.concat(profileUploadFilesInfo);
            // console.log('병합된 업로드 데이터 ', uploadData);

            // 각 Entity 생성
            const consultantUsersEntity = new ConsultantUsersEntity(
                profileData
            );
            consultantUsersEntity.profileStatus = 3; // 인증 완료 상태로 변경
            profilesEntity = new ProfilesEntity(profileData);
            profilesEntity.confirmRequestDate =
                preProfileInfo.confirmRequestDate; // 이전 요청 시간
            profilesEntity.confirmCompleteDate = new Date();
            // console.log('엔터티 확인 : ', profilesEntity);
            const profileAbilityCertificationIds =
                profileData.abilityCertificationIds;
            const profileAbilityIndustryIds = profileData.abilityIndustryIds;
            const profileAbilityTaskIds = profileData.abilityTaskIds;
            const profileAbilityEtcEntity = new ProfileAbilityEtcEntity(
                profileData.abilityEtc
            );
            const profileAcademicBackgroundEntity = new ProfileAcademicBackgroundEntity(
                profileData.academicBackground
            );
            const profileCareerEntities = profileData.career.map(
                (careerData) => new ProfileCareerEntity(careerData)
            );
            const profileLicenseEntities = profileData.license.map(
                (licenseData) => new ProfileLicenseEntity(licenseData)
            );
            const profileProjectHistoryEntities = profileData.projectHistory.map(
                (projectHistoryData) =>
                    new ProfileProjectHistoryEntity(projectHistoryData)
            );
            const profileUploadFilesEntities = uploadData.map(
                (uploadData) => new ProfileUploadFilesEntity(uploadData)
            );

            // 프로필 정보 생성
            await profilesRepository.updateProfile(
                consultantUsersEntity,
                profilesEntity,
                profileAbilityCertificationIds,
                profileAbilityIndustryIds,
                profileAbilityTaskIds,
                profileAbilityEtcEntity,
                profileAcademicBackgroundEntity,
                profileCareerEntities,
                profileLicenseEntities,
                profileProjectHistoryEntities,
                profileUploadFilesEntities
            );

            return;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
