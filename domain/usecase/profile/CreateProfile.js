const {
    ConsultantUsersEntity,
    TempProfilesEntity,
    TempUploadFilesEntity,
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
module.exports = class CreateProfile {
    constructor(repository) {
        this.repository = repository;
    }
    async excute(userData, profileData, uploadData) {
        try {
            let {
                tempProfilesRepository,
                tempUploadFilesRepository,
                profilesRepository,
            } = this.repository;
            // userData.userType = 1; // 테스트용
            // if (userData.userType !== 1) {
            //     throw new UserTypeException('사용자 타입');
            // }

            // 이전에 저장한 임시저장 프로필이 있다면 가져오기
            const tempProfilesEntity = new TempProfilesEntity(userData);
            const preTempProfileInfo = await tempProfilesRepository.getTempProfile(
                tempProfilesEntity
            );

            if (!!preTempProfileInfo) {
                // 기존 업로드 파일 정보리스트  가져오기
                let tempUploadFilesEntity = new TempUploadFilesEntity(
                    preTempProfileInfo
                );
                const tempUploadFilesInfo = await tempUploadFilesRepository.getTempUploadFiles(
                    tempUploadFilesEntity
                );
                console.log('임시저장한 파일들 정보 ', tempUploadFilesInfo);
                // 새로운 업로드 파일과 병합
                uploadData = uploadData.concat(tempUploadFilesInfo);
                console.log('병합된 업로드 데이터 ', uploadData);
            }

            // 각 Entity 생성
            const consultantUsersEntity = new ConsultantUsersEntity(userData);
            consultantUsersEntity.phoneNum = profileData.phoneNum;
            consultantUsersEntity.profileStatus = 2; // 인증요청 상태로 변경

            const profilesEntity = new ProfilesEntity(profileData);
            profilesEntity.consultantUserId = userData.consultantUserId; // 사용자 id
            const profileAbilityCertificationIds =
                profileData.abilityCertificationIds;
            // const profileAbilityIndustryIds = profileData.abilityIndustryIds;
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
            await profilesRepository.createProfile(
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
